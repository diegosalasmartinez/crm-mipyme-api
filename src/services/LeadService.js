const { Lead } = require('../models/index');

class LeadService {
  async getLeads(companyId, page, rowsPerPage) {
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
  }

  async addLead(companyId, leadDTO) {
    console.log(leadDTO);
    const lead = await Lead.create({
      companyId,
    });
    return lead;
  }
}

module.exports = LeadService;
