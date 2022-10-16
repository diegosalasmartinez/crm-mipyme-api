const { Deal } = require('../models/index');
const { BadRequestError } = require('../errors');

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
      await Deal.create(
        {
          ...dealDTO,
          origin: 'CAMPAIGN',
          step: 'CLASIFICATION',
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
