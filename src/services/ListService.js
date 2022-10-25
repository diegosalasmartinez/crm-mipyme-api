const moment = require('moment');
const { sequelize } = require('../models/index');
const { List, Lead, User, ClassificationMarketing } = require('../models/index');
const { BadRequestError } = require('../errors');
const { months } = require('../utils');

class ListService {
  async getLists(idCompany, page = 0, rowsPerPage = 10) {
    try {
      const { rows: data = [], count } = await List.findAndCountAll({
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        required: true,
        include: [
          {
            model: User,
            as: 'creator',
            where: { idCompany },
            attributes: [],
          },
          {
            model: Lead,
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

  async getListByIdSimple(id) {
    try {
      const list = await List.findOne({
        where: {
          id,
        },
      });
      return list;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getListById(id) {
    try {
      const list = await List.findOne({
        include: [
          {
            model: Lead,
            as: 'leads',
            attributes: ['id', 'name', 'lastName', 'email', 'birthday', 'phone'],
            include: [
              {
                model: ClassificationMarketing,
                as: 'classificationMarketing',
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

  async addLeadsToList(idList, leadsId = []) {
    const t = await sequelize.transaction();
    try {
      const list = await List.findByPk(idList);
      for (const idLead of leadsId) {
        await list.addLead(idLead, { through: 'listsxleads' }, { transaction: t });
      }

      await t.commit();
    } catch (e) {
      await t.rollback();
      throw new BadRequestError(e.message);
    }
  }

  async getListsByArrayId(ids) {
    try {
      const lists = await List.findAll({
        include: [
          {
            model: Lead,
            as: 'leads',
            attributes: ['id'],
          },
        ],
        where: {
          id: ids,
        },
      });
      return lists;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getListStats(list) {
    try {
      // Lead generation
      var chartLabels = {};
      var d = new Date();
      d.setDate(1);
      for (var m_month = 0; m_month < 9; m_month++) {
        chartLabels[moment(d).format('YYYY-MM')] = {
          value: 0,
          name: months[d.getMonth()],
        };
        d.setMonth(d.getMonth() - 1);
      }

      list.leads.forEach((lead) => {
        const k = moment(lead.listsxleads.createdAt).format('YYYY-MM').slice(0, 7);
        if (chartLabels[k]) {
          chartLabels[k] = { value: chartLabels[k].value + 1, name: chartLabels[k].name };
        }
      });

      const data = Object.entries(chartLabels)
        .map((entry) => entry[1].value)
        .reverse();
      const label = Object.entries(chartLabels)
        .map((entry) => entry[1].name)
        .reverse();
      const leadGeneration = { data, label };

      // Lead Distribution
      const distributionObj = {
        started: 0,
        ready_marketing: 0,
        marketing_engaged: 0,
        ready_sales: 0,
      };
      list.leads.forEach(function (lead) {
        const classification = lead.classificationMarketing.key;
        distributionObj[classification] = (distributionObj[classification] || 0) + 1;
      });
      const distribution = Object.keys(distributionObj).map((key) => distributionObj[key]);

      return { leadGeneration, distribution };
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = ListService;
