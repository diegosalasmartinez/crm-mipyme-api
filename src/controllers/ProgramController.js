const { StatusCodes } = require('http-status-codes');
const ProgramService = require('../services/ProgramService');

const getProgram = async (req, res) => {
  const { idProgram } = req.params
  const programService = new ProgramService();
  const program = await programService.getProgram(idProgram);
  res.status(StatusCodes.OK).json(program);
};

module.exports = {
  getProgram
};
