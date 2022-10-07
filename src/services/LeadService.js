const { Lead } = require('../models/index');
const { BadRequestError } = require('../errors');

class LeadService {
  async getLeads(companyId, page, rowsPerPage) {
    try {
      const leads = await Lead.findAll({
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        where: {
          companyId,
          active: true,
        },
      });
      const count = await Lead.count({
        where: {
          companyId,
          active: true,
        },
      });
      return { leads, count };
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async addLead(companyId, userId, leadDTO) {
    try {
      const lead = await Lead.create({
        ...leadDTO,
        companyId,
        createdBy: userId,
      });
      return lead;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = LeadService;
