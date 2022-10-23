const { TicketStatus } = require('../models/index');
const { BadRequestError } = require('../errors');

class TicketStatusService {
  async getDefault() {
    try {
      const types = await TicketStatus.findAll();
      return types[0];
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async get(key) {
    try {
      const type = await TicketStatus.findOne({
        where: { key },
      });
      return type;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = TicketStatusService;
