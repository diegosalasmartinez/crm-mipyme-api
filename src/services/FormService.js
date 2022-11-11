const { Form, sequelize } = require('../models/index');
const { BadRequestError } = require('../errors');
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
      const list = await Form.findOne({
        where: {
          id,
        },
      });
      return list;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getFormById(id) {
    try {
      const list = await Form.findOne({
        where: {
          id,
        },
      });
      return list;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
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
