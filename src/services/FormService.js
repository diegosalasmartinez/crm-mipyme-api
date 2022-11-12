const moment = require('moment');
const { Form, List, ClassificationMarketing, sequelize } = require('../models/index');
const { BadRequestError, NotFoundError } = require('../errors');
const { generateChartLabels } = require('../utils');
const LeadService = require('./LeadService');
const leadService = new LeadService();

class FormService {
  async getForms(idCompany, page = 0, rowsPerPage = 10) {
    try {
      const { rows: data = [], count } = await Form.findAndCountAll({
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        required: true,
        where: {
          idCompany,
          active: true,
        },
      });
      return { data, count };
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getFormSimple(id) {
    try {
      const form = await Form.findOne({
        include: [
          {
            model: List,
            as: 'lists',
          },
        ],
        where: {
          id,
        },
      });
      return form;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getFormById(id) {
    try {
      const form = await Form.findOne({
        where: {
          id,
        },
      });
      if (!form) {
        throw new NotFoundError('No se encontr');
      }
      const stats = await this.getStats(form);
      const formJSON = form.toJSON();
      return { ...formJSON, stats };
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getStats(form) {
    const leads = await form.getLeads({
      include: [
        {
          model: ClassificationMarketing,
          as: 'classificationMarketing',
        },
      ],
    });

    const chartLabels = generateChartLabels();
    const distribution = {
      started: 0,
      ready_marketing: 0,
      marketing_engaged: 0,
      ready_sales: 0,
    };
    leads.forEach((lead) => {
      const k = moment(lead.createdAt).format('YYYY-MM').slice(0, 7);
      const classification = lead.classificationMarketing.key;
      distribution[classification] = (distribution[classification] || 0) + 1;
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

    return { distribution, leadGeneration };
  }
  
  async addForm(idCompany, formDTO) {
    const t = await sequelize.transaction();
    try {
      const form = await Form.create(
        {
          name: formDTO.name,
          title: formDTO.title,
          subtitle: formDTO.subtitle,
          textButton: formDTO.textButton,
          idCompany,
        },
        { transaction: t }
      );

      for (const idList of formDTO.listsId) {
        await form.addList(idList, { through: 'listsxforms' }, { transaction: t });
      }

      await t.commit();
    } catch (e) {
      await t.rollback();
      throw new BadRequestError(e.message);
    }
  }

  async addLead(idForm, leadDTO) {
    try {
      const lead = { ...leadDTO, idForm };
      await leadService.addLead(null, lead, idForm);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = FormService;
