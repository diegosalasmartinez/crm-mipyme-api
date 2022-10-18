const { DealStep } = require('../models/index');
const { BadRequestError } = require('../errors');

class DealStepService {
  async getDefault() {
    try {
      const steps = await DealStep.findAll();
      return steps[0];
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getAll() {
    try {
      const steps = await DealStep.findAll();
      return steps;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async get(key) {
    try {
      const step = await DealStep.findOne({
        where: { key },
      });
      return step;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = DealStepService;
