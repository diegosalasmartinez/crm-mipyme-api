const { StatusCodes } = require('http-status-codes');
const ProgramService = require('../services/ProgramService');

const getProgram = async (req, res) => {
  const { idProgram } = req.params
  const programService = new ProgramService();
  const program = await programService.getProgram(idProgram);
  res.status(StatusCodes.OK).json(program);
};

const addProgram = async (req, res) => {
  const { idPlan, program } = req.body
  const programService = new ProgramService();
  const programCreated = await programService.addProgram(idPlan, program);
  res.status(StatusCodes.OK).json(programCreated);
}

module.exports = {
  getProgram,
  addProgram
};
