const {
  Plan,
  Program,
  Campaign,
  Company,
  Lead,
  ClassificationMarketing,
} = require('../models/index');
const { BadRequestError } = require('../errors');
const ProgramService = require('./ProgramService');
const programService = new ProgramService();
class PlanService {
  async getPlan(idCompany) {
    try {
      const plan = await Plan.findOne({
        required: true,
        include: [
          {
            model: Company,
            as: 'company',
            attributes: [],
            where: { id: idCompany },
          },
          {
            model: Program,
            as: 'programs',
            attributes: ['id', 'name', 'createdAt'],
            include: [
              {
                model: Campaign,
                as: 'campaigns',
                attributes: ['id', 'numConversions'],
                include: [
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
          },
        ],
        where: {
          active: true,
        },
      });
      return plan;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async addPlan(idCompany, planDTO) {
    try {
      const plan = await Plan.create({
        ...planDTO,
        idCompany,
      });
      return plan;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getPlanStats(plan) {
    try {
      let numConversions = 0;
      let numDeals = 0;
      let sales = 0;
      let distribution = [0, 0, 0, 0];

      for (let program of plan.programs) {
        const stats = await programService.getProgramStats(program);
        numConversions += stats.numConversions;
        numDeals += stats.numDeals;
        sales += stats.sales;
        distribution = distribution.map(function (num, idx) {
          return num + stats.distribution[idx];
        });
      }
      return { numConversions, numDeals, sales, distribution };
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = PlanService;
