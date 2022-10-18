const { ActivityType } = require('../models/index');
const { BadRequestError } = require('../errors');

class ActivityTypeService {
  async getDefault() {
    try {
      const types = await ActivityType.findAll();
      return types[0];
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getAll() {
    try {
      const types = await ActivityType.findAll();
      return types;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async get(key) {
    try {
      const type = await ActivityType.findOne({
        where: { key },
      });
      return type;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = ActivityTypeService;
