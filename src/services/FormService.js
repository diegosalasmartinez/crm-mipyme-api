const { Form } = require('../models/index');
const { BadRequestError } = require('../errors');

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
    try {
      await Form.create({
        name: formDTO.name,
        title: formDTO.name,
        idCompany,
      });
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = FormService;
