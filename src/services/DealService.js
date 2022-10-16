const { Deal } = require('../models/index');
const { BadRequestError } = require('../errors');
const DealOriginService = require('./DealOriginService')
const dealOriginService = new DealOriginService()
const DealStepService = require('./DealStepService')
const dealStepService = new DealStepService()

class DealService {
  async addDeal(idLead, dealDTO, t) {
    try {
      await Deal.create(
        {
          ...dealDTO,
          idLead,
        },
        { transaction: t }
      );
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async addDealThroughCampaign(idUser, idContact, dealDTO, idCampaign, t) {
    try {
      const origin = await dealOriginService.get('campaign')
      const step = await dealStepService.getDefault()

      await Deal.create(
        {
          ...dealDTO,
          idOrigin: origin.id,
          idStep: step.id,
          idContact,
          idCampaign,
          createdBy: idUser
        },
        { transaction: t }
      );
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = DealService;
