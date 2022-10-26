const { DealOrigin } = require('../models/index');
const { BadRequestError } = require('../errors');

class DealOriginService {
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
