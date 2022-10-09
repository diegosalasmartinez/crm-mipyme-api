const { StatusCodes } = require('http-status-codes');
const PlanService = require('../services/PlanService');

const getPlan = async (req, res) => {
  const { idCompany } = req.user;
  const planService = new PlanService();
  const plan = await planService.getPlan(idCompany);
  res.status(StatusCodes.OK).json(plan);
};

const addPlan = async (req, res) => {
  const { id: idUser } = req.user;
  const plan = req.body;
  const planService = new PlanService();
  const planCreated = await planService.addPlan(idUser, plan);
  res.status(StatusCodes.OK).json(planCreated);
};

const addProgram = async (req, res) => {
  const { idPlan, program } = req.body
  const planService = new PlanService();
  const programCreated = await planService.addProgram(idPlan, program);
  res.status(StatusCodes.OK).json(programCreated);
}

module.exports = {
  getPlan,
  addPlan,
  addProgram
};
