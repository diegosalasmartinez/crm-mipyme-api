const { CampaignStatus } = require('../models/index');
const { BadRequestError } = require('../errors');

class CampaignStatusService {
  async getDefault() {
    try {
      const status = await CampaignStatus.findAll();
      return status[0];
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async get(key) {
    try {
      const status = await CampaignStatus.findOne({
        where: { key },
      });
      return status;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = CampaignStatusService;
