const { ClassificationSales } = require('../models/index');
const { BadRequestError } = require('../errors');

class ClassificationSalesService {
  async getDefault() {
    try {
      const classifications = await ClassificationSales.findAll({});
      return classifications[0];
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async get(key) {
    try {
      const classification = await ClassificationSales.findOne({
        where: { key },
      });
      return classification;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getByName(name) {
    try {
      const classification = await ClassificationSales.findOne({
        where: { name },
      });
      return classification;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = ClassificationSalesService;
