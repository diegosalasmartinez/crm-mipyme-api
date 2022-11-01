const {
  Program,
  Campaign,
  CampaignStatus,
  Lead,
  ClassificationMarketing,
  User,
} = require('../models/index');
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
              {
                model: Lead,
                as: 'leads',
                attributes: ['id'],
                include: [
                  {
                    model: ClassificationMarketing,
                    as: 'classificationMarketing',
                  },
                ],
              },
            ],
          },
        ],
        order: [
          [{ model: Campaign, as: 'campaigns' }, 'startDate', 'ASC'],
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
      let distribution = [0, 0, 0, 0];

      for (let campaign of program.campaigns) {
        const stats = await campaignService.getCampaignStats(campaign);
        numConversions += stats.numConversions;
        numDeals += stats.numDeals;
        sales += stats.sales;
        distribution = distribution.map(function (num, idx) {
          return num + stats.distribution[idx];
        });
      }
      return {
        numConversions,
        numDeals,
        sales,
        numCampaigns: program.campaigns.length,
        distribution,
      };
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = ProgramService;
