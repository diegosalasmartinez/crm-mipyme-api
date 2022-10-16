const { DiscountType } = require('../models/index');
const { BadRequestError } = require('../errors');

class DiscountTypeService {
  async getDefault() {
    try {
      const types = await DiscountType.findAll();
      return types[0];
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getType(key) {
    try {
      const type = await DiscountType.findOne({
        where: { key },
      });
      return type;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = DiscountTypeService;
