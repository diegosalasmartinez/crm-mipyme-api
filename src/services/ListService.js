const { sequelize, Sequelize } = require('../models/index');
const { List, Lead, User, ListXLead } = require('../models/index');
const { BadRequestError } = require('../errors');

class ListService {
  async getLists(idCompany, page, rowsPerPage) {
    try {
      const { rows: data, count } = await List.findAndCountAll({
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
      return { data, count };
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
            include: [
              {
                model: Lead,
                as: 'lead',
                attributes: [],
              },
            ],
            attributes: [
              [Sequelize.literal('"leads->lead"."id"'), 'id'],
              [Sequelize.literal('"leads->lead"."name"'), 'name'],
              [Sequelize.literal('"leads->lead"."lastName"'), 'lastName'],
              [Sequelize.literal('"leads->lead"."email"'), 'email'],
              [Sequelize.literal('"leads->lead"."birthday"'), 'birthday'],
              [Sequelize.literal('"leads->lead"."phone"'), 'phone'],
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
