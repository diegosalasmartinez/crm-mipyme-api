const { LostType } = require('../models/index');
const { BadRequestError } = require('../errors');

class LostTypeService {
  async getDefault() {
    try {
      const types = await LostType.findAll();
      return types[0];
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async get(key) {
    try {
      const type = await LostType.findOne({
        where: { key },
      });
      return type;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = LostTypeService;
