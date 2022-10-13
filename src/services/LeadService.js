const {
  Lead,
  User,
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

  async getLeadByIdSimple(id) {
    try {
      const lead = await Lead.findOne({
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

  async getLeadById(id) {
    try {
      const lead = await Lead.findOne({
        include: [
          {
            model: List,
            as: 'lists',
            include: [{ model: Lead, as: 'leads', attributes: ['id'] }],
          },
          {
            model: ClassificationMarketing,
            as: 'marketingClassification',
            attributes: ['key', 'name'],
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
      const classifications = await classificationService.getDefault();
      const lead = await Lead.create({
        ...leadDTO,
        createdBy: userId,
        idClassificationMarketing: classifications[0].id,
      });
      return lead;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = LeadService;
