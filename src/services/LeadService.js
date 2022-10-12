const {
  Lead,
  User,
  ListXLead,
  List,
  ClassificationMarketing,
} = require('../models/index');
const { BadRequestError } = require('../errors');
const ClassificationMarketingService = require('./ClassificationMarketingService');
const classificationService = new ClassificationMarketingService();

class LeadService {
  async getLeads(idCompany, page, rowsPerPage) {
    try {
      const { rows: data = [], count } = await Lead.findAndCountAll({
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        attributes: [
          'id',
          'name',
          'lastName',
          'email',
          'birthday',
          'phone',
          'birthday',
          'companyName',
        ],
        include: [
          {
            model: User,
            as: 'creator',
            where: { idCompany },
            attributes: [],
          },
          {
            model: ClassificationMarketing,
            as: 'marketingClassification',
            attributes: ['key', 'name'],
          },
        ],
        where: {
          active: true,
        },
        order: [['createdAt', 'DESC']],
      });
      return { data, count };
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
            include: [
              {
                model: List,
                as: 'list',
                include: [
                  {
                    model: ListXLead,
                    as: 'leads',
                    attributes: ['id'],
                  },
                ],
              },
            ],
            attributes: ['id'],
          },
        ],
        where: {
          id,
          active: true,
        },
      });
      if (!lead) return null;
      const leadJSON = lead.toJSON();
      const leadFormatted = {
        ...leadJSON,
        lists: leadJSON.lists.map((l) => l.list),
      };
      return leadFormatted;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async addLead(userId, leadDTO) {
    try {
      const classifications = await classificationService.getDefault();
      console.log(classifications[0].id);
      const lead = await Lead.create({
        ...leadDTO,
        createdBy: userId,
        idClassificationMarketing: classifications[0].id,
      });
      return lead;
    } catch (e) {
      console.log(e);
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = LeadService;
