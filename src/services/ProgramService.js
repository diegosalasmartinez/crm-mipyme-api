const { Program, Campaign, User } = require('../models/index');
const { BadRequestError } = require('../errors');

class ProgramService {
  async getProgram(id) {
    try {
      const program = await Program.findOne({
        include: [
          {
            model: Campaign,
            as: 'campaigns',
            attributes: ['id', 'name', 'startDate', 'endDate'],
            include: [
              {
                model: User,
                as: 'creator',
                attributes: ['name', 'lastName'],
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
}

module.exports = ProgramService;
