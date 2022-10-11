const { Program } = require('../models/index');
const { BadRequestError } = require('../errors');

class ProgramService {
  async getProgram(id) {
    try {
      const program = await Program.findOne({
        where: {
          id
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
        idPlan
      });
      return program;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = ProgramService;
