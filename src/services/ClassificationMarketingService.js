const { ClassificationMarketing } = require('../models/index');
const { BadRequestError } = require('../errors');

class ClassificationMarketingService {
  async getDefault() {
    try {
      const classifications = await ClassificationMarketing.findAll({
        order: [['minPoints', 'ASC']]
      });
      return classifications[0];
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = ClassificationMarketingService;
