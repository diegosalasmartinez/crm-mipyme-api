const { TicketPriority } = require('../models/index');
const { BadRequestError } = require('../errors');

class TicketPriorityService {
  async getDefault() {
    try {
      const types = await TicketPriority.findAll();
      return types[0];
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async get(key) {
    try {
      const type = await TicketPriority.findOne({
        where: { key },
      });
      return type;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = TicketPriorityService;
