const { Program, Campaign, CampaignStatus, User } = require('../models/index');
const { BadRequestError } = require('../errors');
const CampaignService = require('./CampaignService');
const campaignService = new CampaignService();
class ProgramService {
  async getProgramById(id) {
    try {
      const program = await Program.findOne({
        include: [
          {
            model: Campaign,
            as: 'campaigns',
            attributes: ['id', 'name', 'numConversions', 'startDate', 'endDate'],
            include: [
              {
                model: User,
                as: 'creator',
                attributes: ['name', 'lastName'],
              },
              {
                model: CampaignStatus,
                as: 'status',
              },
            ],
          },
        ],
        where: {
          id,
        },
      });
      return program;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async addProgram(idPlan, programDTO) {
    try {
      const program = await Program.create({
        ...programDTO,
        idPlan,
      });
      return program;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getProgramStats(program) {
    try {
      let numConversions = 0;
      let numDeals = 0;
      let sales = 0;
      for (let campaign of program.campaigns) {
        const stats = await campaignService.getCampaignStats(campaign);
        numConversions += stats.numConversions;
        numDeals += stats.numDeals;
        sales += stats.sales;
      }
      return { numConversions, numDeals, sales };
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = ProgramService;
