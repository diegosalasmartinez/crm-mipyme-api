const moment = require('moment');
const { sequelize } = require('../models/index');
const { List, Lead, User, ClassificationMarketing } = require('../models/index');
const { BadRequestError } = require('../errors');
const { months } = require('../utils');
const LeadService = require('./LeadService');
const leadService = new LeadService();
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
        where: {
          id,
        },
      });
      return list;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getLeadsByList(idList, page = 0, rowsPerPage = 10) {
    try {
      const list = await List.findByPk(idList);
      const count = await list.countLeads();
      const leads = await list.getLeads({
        attributes: ['id', 'name', 'lastName', 'email', 'birthday', 'phone'],
        include: [
          {
            model: ClassificationMarketing,
            as: 'classificationMarketing',
          },
        ],
        offset: page * rowsPerPage,
        limit: rowsPerPage,
      });
      return { data: leads, count };
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getAvailableLeads(idCompany, idList, page, rowsPerPage) {
    try {
      const list = await this.getListById(idList);
      const leads = await list.getLeads({
        attributes: ['id'],
        where: {
          active: true,
        },
      });
      const leadsId = leads.map((lead) => lead.id);

      return leadService.getLeadsExcept(idCompany, leadsId, page, rowsPerPage);
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

  async removeLeadFromList(idList, idLead) {
    const t = await sequelize.transaction();
    try {
      const list = await List.findByPk(idList);
      await list.removeLead(idLead, { through: 'listsxleads' }, { transaction: t });

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
      const leads = await list.getLeads({
        attributes: [],
        include: [
          {
            model: ClassificationMarketing,
            as: 'classificationMarketing',
          },
        ],
      });
      const chartLabels = {};
      const d = new Date();
      d.setDate(1);
      for (let m_month = 0; m_month < 9; m_month++) {
        chartLabels[moment(d).format('YYYY-MM')] = {
          value: 0,
          name: months[d.getMonth()],
        };
        d.setMonth(d.getMonth() - 1);
      }

      leads.forEach((lead) => {
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
      leads.forEach(function (lead) {
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
