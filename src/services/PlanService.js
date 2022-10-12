const { Plan, Program, Campaign, User } = require('../models/index');
const { BadRequestError } = require('../errors');

class PlanService {
  async getPlan(idCompany) {
    try {
      const plan = await Plan.findOne({
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['idCompany'],
            where: { idCompany },
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

  async addPlan(idUser, planDTO) {
    try {
      const plan = await Plan.create({
        ...planDTO,
        createdBy: idUser,
      });
      return plan;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = PlanService;
