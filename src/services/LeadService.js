const { Lead, User, ListXLead, List } = require('../models/index');
const { BadRequestError } = require('../errors');

class LeadService {
  async getLeads(idCompany, page, rowsPerPage) {
    try {
      const { rows: leads, count } = await Lead.findAndCountAll({
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        attributes: ['id', 'name', 'lastName', 'email', 'birthday', 'phone', 'birthday', 'companyName'],
        include: [
          {
            model: User,
            as: 'user',
            where: { idCompany },
            attributes: [],
          },
        ],
        where: {
          active: true,
        },
      });
      return { leads, count };
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getLeadById(id) {
    try {
      const lead = await Lead.findOne({
        include: [
          {
            model: ListXLead,
            as: 'lists',
            attributes: ['id'],
            include: [
              {
                model: List,
                as: 'list',
                include: [
                  {
                    model: ListXLead,
                    as: 'leads',
                    attributes: ['id'],
                  }
                ]
              },
            ],
          },
        ],
        where: {
          id,
          active: true,
        },
      });
      return lead;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async addLead(userId, leadDTO) {
    try {
      const lead = await Lead.create({
        createdBy: userId,
        ...leadDTO,
      });
      return lead;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = LeadService;
