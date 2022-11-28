const moment = require('moment');
const { Op } = require('sequelize');
const { faker } = require('@faker-js/faker');
const {
  Lead,
  User,
  List,
  Contact,
  Form,
  ClassificationMarketing,
  ClassificationSales,
} = require('../models/index');
const { BadRequestError } = require('../errors');
const ClassificationMarketingService = require('./ClassificationMarketingService');
const classificationService = new ClassificationMarketingService();

const attributes = [
  'id',
  'name',
  'lastName',
  'email',
  'birthday',
  'phone',
  'birthday',
  'companyName',
  'idForm',
  'createdAt',
];

class LeadService {
  async getLeads(
    idCompany,
    page = 0,
    rowsPerPage = 10,
    name = '',
    email = '',
    classificationKey = ''
  ) {
    try {
      const classification = await classificationService.get(classificationKey);
      const { rows: data = [], count } = await Lead.findAndCountAll({
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        required: false,
        include: [
          {
            model: User,
            as: 'creator',
            attributes: [],
          },
          {
            model: Form,
            as: 'form',
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
          [Op.or]: [
            {
              '$creator.idCompany$': idCompany,
            },
            {
              '$form.idCompany$': idCompany,
            },
          ],
          name: {
            [Op.iLike]: `%${name}%`,
          },
          email: {
            [Op.iLike]: `%${email}%`,
          },
          idClassificationMarketing: classification
            ? classification.id
            : {
                [Op.ne]: null,
              },
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
        attributes,
        required: false,
        include: [
          {
            model: User,
            as: 'creator',
            attributes: [],
          },
          {
            model: Form,
            as: 'form',
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
          [Op.or]: [
            {
              '$creator.idCompany$': idCompany,
            },
            {
              '$form.idCompany$': idCompany,
            },
          ],
        },
      });
      return leads;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getLeadsExcept(idCompany, leadsId, page = 0, rowsPerPage = 10, whereRules) {
    try {
      const { rows: data = [], count } = await Lead.findAndCountAll({
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        attributes,
        required: false,
        include: [
          {
            model: User,
            as: 'creator',
            attributes: [],
          },
          {
            model: Form,
            as: 'form',
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
          id: {
            [Op.notIn]: leadsId,
          },
          [Op.or]: [
            {
              '$creator.idCompany$': idCompany,
            },
            {
              '$form.idCompany$': idCompany,
            },
          ],
          ...whereRules,
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
            model: Contact,
            as: 'contact',
            required: false,
            include: [
              {
                model: User,
                as: 'assigned',
                attributes: ['id', 'name', 'lastName'],
              },
              {
                model: ClassificationSales,
                as: 'classificationSales',
              },
            ],
          },
          {
            model: List,
            as: 'lists',
            include: [{ model: Lead, as: 'leads', attributes: ['id'] }],
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

  async addLead(idUser = null, leadDTO, idForm = null) {
    try {
      const classification = await classificationService.getDefault();
      const lead = await Lead.create({
        ...leadDTO,
        createdBy: idUser,
        idForm,
        idClassificationMarketing: classification.id,
      });
      return lead;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async updateLead(leadDTO) {
    try {
      const lead = await Lead.update(
        {
          name: leadDTO.name,
          lastName: leadDTO.lastName,
          email: leadDTO.email,
          phone: leadDTO.phone,
          sex: leadDTO.sex,
          companyName: leadDTO.companyName,
          address: leadDTO.address,
          city: leadDTO.city,
          maritalStatus: leadDTO.maritalStatus,
          notes: leadDTO.notes,
        },
        { where: { id: leadDTO.id } }
      );
      return lead;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async validateLead(idLead, emailValidated) {
    try {
      const statusInitial = await classificationService.getDefault();
      const statusReady = await classificationService.get('ready_marketing');
      const lead = await Lead.findByPk(idLead);

      const updateValues = {};
      if (emailValidated === 'true') {
        updateValues.emailValidated = true;
      } else {
        updateValues.phoneValidated = true;
      }
      if (lead.idClassificationMarketing === statusInitial.id) {
        updateValues.idClassificationMarketing = statusReady.id;
      }

      await Lead.update(updateValues, { where: { id: idLead } });
      return lead;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async excludeLead(idLead) {
    try {
      await Lead.update({ active: false }, { where: { id: idLead } });
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  generateWhereClausses(segments) {
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
      } else if (s.rule === 'lte') {
        criteria[Op.gte] = moment(new Date()).subtract(s.detail, 'years');
      } else if (s.rule === 'gte') {
        criteria[Op.lte] = moment(new Date()).subtract(s.detail, 'years');
      }

      if (s.field === 'age') {
        whereClausses.birthday = criteria;
      } else {
        whereClausses[s.field] = criteria;
      }
    }
    return whereClausses;
  }

  async executeSegments(idCompany, segments, lists) {
    try {
      const whereClausses = this.generateWhereClausses(segments);
      const leads = await Lead.findAll({
        attributes: ['id'],
        required: true,
        include: [
          {
            model: User,
            as: 'creator',
            attributes: [],
          },
          // {
          //   model: List,
          //   as: 'lists',
          //   where: { id: lists },
          //   attributes: [],
          // },
        ],
        where: {
          ...whereClausses,
          '$creator.idCompany$': idCompany,
          emailValidated: true,
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

  async convertClient(idLead) {
    try {
      const classificationClient = await classificationService.get('ready_sales');
      const classification = await classificationService.get('marketing_engaged');

      const lead = await Lead.findOne({
        id: idLead,
        where: { idClassificationMarketing: classification.id },
      });

      if (lead) {
        await Lead.update(
          {
            idClassificationMarketing: classificationClient.id,
          },
          { where: { id: idLead } }
        );
        return true;
      }
      return false;
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

  async seed_updateLeadsToRM(idCompany, number) {
    try {
      const leads = await Lead.findAll({
        limit: number,
        include: [
          {
            model: User,
            as: 'creator',
          },
          {
            model: Form,
            as: 'form',
          },
        ],
        where: {
          active: true,
          [Op.or]: [
            {
              '$creator.idCompany$': idCompany,
            },
            {
              '$form.idCompany$': idCompany,
            },
          ],
        },
      });
      const leadsIds = leads.map((l) => l.id);
      const classification = await classificationService.get('ready_marketing');
      await Lead.update(
        {
          idClassificationMarketing: classification.id,
          emailValidated: true,
        },
        { where: { id: leadsIds } }
      );
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = LeadService;
