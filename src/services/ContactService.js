const { Contact, Lead, User, sequelize } = require('../models/index');
const { BadRequestError } = require('../errors');
const DealService = require('./DealService');
const dealService = new DealService();
const LeadService = require('./LeadService');
const leadService = new LeadService();
const ClassificationSalesService = require('./ClassificationSalesService');
const classificationSalesService = new ClassificationSalesService();
const CampaignService = require('./CampaignService');
const campaignService = new CampaignService();

class ContactService {
  async getContacts(idCompany, page = 0, rowsPerPage = 10) {
    try {
      const { rows: data = [], count } = await Contact.findAndCountAll({
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        required: true,
        include: [
          {
            model: Lead,
            as: 'lead',
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
            ],
          },
          {
            model: User,
            as: 'assigned',
            attributes: ['id', 'name', 'lastName'],
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

  async getContactsByPortfolio(idUser, idCompany, page = 0, rowsPerPage = 10) {
    try {
      const { rows: data = [], count } = await Contact.findAndCountAll({
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        required: true,
        include: [
          {
            model: Lead,
            as: 'lead',
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
            ],
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

  async convertLead(idUser, idLead, assignedTo, idCampaign, registerDeal, deal) {
    const t = await sequelize.transaction();
    try {
      const classification = await classificationSalesService.getDefault();
      const contact = await Contact.create(
        {
          idLead,
          assignedTo,
          idClassificationSales: classification.id,
        },
        { transaction: t }
      );
      await leadService.convertLead(idLead, t);

      if (registerDeal) {
        await dealService.addDeal(idUser, contact.id, deal, idCampaign, null, t);
      }
      if (idCampaign) {
        await campaignService.increaseConvertNumber(idCampaign, t);
      }
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw new BadRequestError(e.message);
    }
  }

  async getContactByLead(idLead) {
    try {
      const contact = await Contact.findOne({
        where: {
          idLead,
        },
      });
      return contact;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = ContactService;
