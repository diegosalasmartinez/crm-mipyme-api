const {
  Lead,
  User,
  List,
  ClassificationMarketing,
} = require('../models/index');
const { BadRequestError } = require('../errors');
const ClassificationMarketingService = require('./ClassificationMarketingService');
const classificationService = new ClassificationMarketingService();
const { faker } = require('@faker-js/faker');

class LeadService {
  async getLeads(idCompany, page = 0, rowsPerPage = 10) {
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
          'createdAt'
        ],
        required: true,
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

  async addLead(idUser, leadDTO) {
    try {
      const classification = await classificationService.getDefault();
      const lead = await Lead.create({
        ...leadDTO,
        createdBy: idUser,
        idClassificationMarketing: classification.id,
      });
      return lead;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async seed_addLeads(idUser, number) {
    try {
      const leadsInfo = [];
      const classification = await classificationService.getDefault();
      for (let i = 0; i < number; i++) {
        const info = {
          name: faker.name.firstName(),
          lastName: faker.name.lastName(),
          birthday: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          address: faker.address.secondaryAddress(),
          createdBy: idUser,
          idClassificationMarketing: classification.id,
        };
        leadsInfo.push(info);
      }
      await Lead.bulkCreate(leadsInfo);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = LeadService;
