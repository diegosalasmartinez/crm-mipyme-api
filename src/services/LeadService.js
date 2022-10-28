const { Op } = require('sequelize');
const { faker } = require('@faker-js/faker');
const {
  Lead,
  Contact,
  User,
  List,
  ClassificationMarketing,
  Campaign,
  Program,
  Deal,
  Quotation,
  QuotationStatus,
} = require('../models/index');
const { BadRequestError } = require('../errors');
const ClassificationMarketingService = require('./ClassificationMarketingService');
const classificationService = new ClassificationMarketingService();
const CampaignStatusService = require('./CampaignStatusService');
const campaignStatusService = new CampaignStatusService();

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
          'createdAt',
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
            as: 'classificationMarketing',
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

  async getAllLeads(idCompany) {
    try {
      const leads = await Lead.findAll({
        attributes: [
          'id',
          'name',
          'lastName',
          'email',
          'birthday',
          'phone',
          'birthday',
          'companyName',
          'createdAt',
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
            as: 'classificationMarketing',
            attributes: ['key', 'name'],
          },
        ],
        where: {
          active: true,
        },
      });
      return leads;
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
      const status = await campaignStatusService.get('running');
      const lead = await Lead.findOne({
        include: [
          {
            model: List,
            as: 'lists',
            include: [{ model: Lead, as: 'leads', attributes: ['id'] }],
          },
          {
            model: Campaign,
            as: 'campaigns',
            attributes: ['id', 'name', 'startDate', 'endDate'],
            include: [
              {
                model: User,
                as: 'creator',
                attributes: ['id', 'name', 'lastName'],
              },
              {
                model: Program,
                as: 'program',
                attributes: ['id', 'name'],
              },
            ],
            where: {
              idStatus: status.id,
              active: true,
            },
          },
          {
            model: Contact,
            as: 'contact',
            attributes: ['id'],
            include: [
              {
                model: Deal,
                as: 'deals',
                attributes: ['id'],
                include: [
                  {
                    model: Quotation,
                    as: 'quotations',
                    attributes: ['id', 'startDate', 'limitDate'],
                    include: [
                      {
                        model: Deal,
                        as: 'deal',
                        attributes: ['id', 'name'],
                      },
                      {
                        model: QuotationStatus,
                        as: 'status',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            model: ClassificationMarketing,
            as: 'classificationMarketing',
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

  async executeSegments(idCompany, segments, lists) {
    try {
      const whereClausses = {};
      for (const s of segments) {
        const criteria = {};
        if (s.rule === 'exist') {
          criteria[Op.not] = null;
        } else if (s.rule === 'is') {
          criteria[Op.eq] = s.detail;
        } else if (s.rule === 'isnt') {
          if (s.detail && s.detail.length > 0) {
            criteria[Op.or] = {
              [Op.is]: null,
              [Op.ne]: s.detail === null ? '' : s.detail,
            };
          } else {
            criteria[Op.or] = {
              [Op.not]: null,
              [Op.ne]: s.detail === null ? '' : s.detail,
            };
          }
        } else {
          console.log(s.field, s.rule, s.detail);
        }
        whereClausses[s.field] = criteria;
      }

      const leads = await Lead.findAll({
        attributes: ['id'],
        required: true,
        include: [
          {
            model: User,
            as: 'creator',
            where: { idCompany },
            attributes: [],
          },
          {
            model: List,
            as: 'lists',
            where: { id: lists },
            attributes: [],
          },
        ],
        where: {
          ...whereClausses,
          active: true,
        },
      });
      return leads;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async convertLead(idLead, t) {
    try {
      const classification = await classificationService.get('marketing_engaged');

      await Lead.update(
        {
          idClassificationMarketing: classification.id,
        },
        { where: { id: idLead }, transaction: t }
      );
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
          createdAt: faker.date.past(),
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
