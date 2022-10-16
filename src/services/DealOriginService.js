const { DealOrigin } = require('../models/index');
const { BadRequestError } = require('../errors');

class DealOriginService {
  async getDefault() {
    try {
      const origins = await DealOrigin.findAll();
      return origins[0];
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async get(key) {
    try {
      const origin = await DealOrigin.findOne({
        where: { key },
      });
      return origin;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = DealOriginService;
