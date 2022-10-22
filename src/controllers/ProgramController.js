const { StatusCodes } = require('http-status-codes');
const ProgramService = require('../services/ProgramService');
const programService = new ProgramService();

const getProgram = async (req, res) => {
  const { idProgram } = req.params;
  const program = await programService.getProgramById(idProgram);
  const stats = await programService.getProgramStats(program);
  res.status(StatusCodes.OK).json({ program, stats });
};

const addProgram = async (req, res) => {
  const { idPlan, program } = req.body;
  const programCreated = await programService.addProgram(idPlan, program);
  res.status(StatusCodes.OK).json(programCreated);
};

module.exports = {
  getProgram,
  addProgram,
};
