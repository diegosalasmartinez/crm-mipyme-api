const { Contact, sequelize } = require('../models/index');
const { BadRequestError } = require('../errors');
const DealService = require('./DealService');
const dealService = new DealService();
const LeadService = require('./LeadService');
const leadService = new LeadService();
const ClassificationSalesService = require('./ClassificationSalesService');
const classificationSalesService = new ClassificationSalesService();


class ContactService {
  async convertLead(lead, registerDeal, deal) {
    const t = await sequelize.transaction();
    try {
      await Contact.create({
        idLead: lead.id,
      });
      if (registerDeal) {
        await dealService.addDeal(lead.id, deal, t);
      }
      await leadService.convertLead(lead.id, t)
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw new BadRequestError(e.message);
    }
  }

  async convertLeadThroughCampaign(idUser, idLead, idCampaign, registerDeal, deal) {
    const t = await sequelize.transaction();
    try {
      const classification = await classificationSalesService.getDefault()
      const contact = await Contact.create({
        idLead,
        idClassificationSales: classification.id
      });
      if (registerDeal) {
        await dealService.addDealThroughCampaign(idUser, contact.id, deal, idCampaign, t);
      }
      await leadService.convertLead(idLead, t)
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = ContactService;
