const { Plan, Program, Campaign, Company } = require('../models/index');
const { BadRequestError } = require('../errors');

class PlanService {
  async getPlan(idCompany) {
    try {
      const plan = await Plan.findOne({
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
                attributes: ['id'],
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
}

module.exports = PlanService;
