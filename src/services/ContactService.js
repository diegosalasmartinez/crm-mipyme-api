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

  async convertLead(contact, registerDeal, deal) {
    const t = await sequelize.transaction();
    try {
      await Contact.create({
        idLead: contact.lead.id,
        assignedTo: contact.assignedTo
      });
      if (registerDeal) {
        await dealService.addDeal(contact.lead.id, deal, t);
      }
      await leadService.convertLead(contact.lead.id, t);
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw new BadRequestError(e.message);
    }
  }

  async convertLeadThroughCampaign(
    idUser,
    idLead,
    idCampaign,
    registerDeal,
    deal
  ) {
    const t = await sequelize.transaction();
    try {
      let contact = await this.getContactByLead(idLead)
      if (!contact) {
        const classification = await classificationSalesService.getDefault();
        await Contact.create({
          idLead,
          idClassificationSales: classification.id,
        });
      }

      if (registerDeal) {
        await dealService.addDealThroughCampaign(
          idUser,
          contact.id,
          deal,
          idCampaign,
          t
        );
      }
      await leadService.convertLead(idLead, t);
      await campaignService.increaseConvertNumber(idCampaign, t);
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
