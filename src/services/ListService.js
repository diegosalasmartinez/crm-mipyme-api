const { List, Lead } = require('../models/index');
const { BadRequestError } = require('../errors');

class ListService {
  async getLists(companyId, page, rowsPerPage) {
    try {
      const lists = await List.findAll({
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        include: {
          model: Lead,
          attributes: ['id'],
          as: 'leads',
        },
        where: {
          companyId,
          active: true,
        },
      });
      const count = await List.count({
        where: {
          companyId,
          active: true,
        },
      });
      return { lists, count };
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getListById(id) {
    try {
      const list = await List.findOne({
        include: {
          model: Lead,
          as: 'leads',
        },
        where: {
          id,
        },
      });
      return list;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async addList(companyId, listDTO) {
    try {
      const list = await List.create({
        ...listDTO,
        companyId,
      });
      return list;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = ListService;
