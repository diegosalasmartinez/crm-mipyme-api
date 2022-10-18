const { TicketType } = require('../models/index');
const { BadRequestError } = require('../errors');

class TicketTypeService {
  async getDefault() {
    try {
      const types = await TicketType.findAll();
      return types[0];
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async get(key) {
    try {
      const type = await TicketType.findOne({
        where: { key },
      });
      return type;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = TicketTypeService;
