const { ActivityStatus } = require('../models/index');
const { BadRequestError } = require('../errors');

class ActivityStatusService {
  async getDefault() {
    try {
      const types = await ActivityStatus.findAll();
      return types[0];
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async get(key) {
    try {
      const type = await ActivityStatus.findOne({
        where: { key },
      });
      return type;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = ActivityStatusService;
