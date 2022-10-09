const { Plan, User } = require('../models/index');
const { BadRequestError } = require('../errors');

class PlanService {
  async getPlan(idCompany) {
    try {
      console.log(idCompany);
      const plan = await Plan.findOne({
        include: [
          {
            model: User,
            as: 'user',
            where: { idCompany },
            attributes: [],
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
