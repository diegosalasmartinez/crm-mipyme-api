const { MarketingKPI } = require('../models/index');
const { BadRequestError } = require('../errors');

class MarketingKPIService {
  async getAll() {
    try {
      const kpis = await MarketingKPI.findAll();
      return kpis;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async get(key) {
    try {
      const kpi = await MarketingKPI.findOne({
        where: { key },
      });
      return kpi;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = MarketingKPIService;
