const { QuotationStatus } = require('../models/index');
const { BadRequestError } = require('../errors');

class QuotationStatusService {
  async getDefault() {
    try {
      const types = await QuotationStatus.findAll();
      return types[0];
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async get(key) {
    try {
      const type = await QuotationStatus.findOne({
        where: { key },
      });
      return type;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = QuotationStatusService;
