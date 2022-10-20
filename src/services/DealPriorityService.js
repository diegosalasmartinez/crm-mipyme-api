const { DealPriority } = require('../models/index');
const { BadRequestError } = require('../errors');

class DealPriorityService {
  async getDefault() {
    try {
      const types = await DealPriority.findAll();
      return types[0];
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async get(key) {
    try {
      const type = await DealPriority.findOne({
        where: { key },
      });
      return type;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = DealPriorityService;
