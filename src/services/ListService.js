const { sequelize } = require('../models/index');
const { List, Lead, User, ListXLead } = require('../models/index');
const { BadRequestError } = require('../errors');

class ListService {
  async getLists(idCompany, page, rowsPerPage) {
    try {
      const { rows: lists, count } = await List.findAndCountAll({
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        include: [
          {
            model: User,
            as: 'user',
            where: { idCompany },
            attributes: [],
          },
          {
            model: ListXLead,
            as: 'leads',
            attributes: ['id'],
          },
        ],
        where: {
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
        include: [
          {
            model: ListXLead,
            as: 'leads',
            attributes: ['id'],
            include: [
              {
                model: Lead,
                as: 'lead',
                attributes: [
                  'id',
                  'name',
                  'lastName',
                  'email',
                  'birthday',
                  'phone',
                ],
              },
            ],
          },
        ],
        where: {
          id,
        },
      });
      return list;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async addList(idUser, listDTO) {
    try {
      const list = await List.create({
        name: listDTO.name,
        createdBy: idUser,
      });
      await this.addLeadsToList(list.id, listDTO.leadsId);
      return list;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async addLeadsToList(idList, leadsId) {
    const t = await sequelize.transaction();

    try {
      const leadsBulk = [];
      for (let idLead of leadsId) {
        const leadBulk = { idList, idLead };
        leadsBulk.push(leadBulk);
      }
      await ListXLead.bulkCreate(leadsBulk, { transaction: t });

      await t.commit();
    } catch (e) {
      await t.rollback();
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = ListService;
