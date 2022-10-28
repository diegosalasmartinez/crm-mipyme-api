const { Rejection } = require('../models/index');
const { BadRequestError } = require('../errors');
const CampaignService = require('./CampaignService');
const campaignService = new CampaignService();

class RejectionService {
  async addRejection(idUser, idQuotation, idTicket, idCampaign, reason) {
    try {
      const rejection = await Rejection.create({
        idQuotation,
        idTicket,
        idCampaign,
        reason,
        createdBy: idUser,
      });
      if (idCampaign) {
        await campaignService.rejectCampaign(idCampaign);
      }
      return rejection;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = RejectionService;
