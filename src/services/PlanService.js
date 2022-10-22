const { Plan, Program, Campaign, Company } = require('../models/index');
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
      for (let program of plan.programs) {
        const stats = await programService.getProgramStats(program);
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

module.exports = PlanService;
