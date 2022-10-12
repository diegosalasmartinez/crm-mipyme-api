const { StatusCodes } = require('http-status-codes');
const PlanService = require('../services/PlanService');
const planService = new PlanService();

const getPlan = async (req, res) => {
  const { idCompany } = req.user;
  const plan = await planService.getPlan(idCompany);
  res.status(StatusCodes.OK).json(plan);
};

const addPlan = async (req, res) => {
  const { idCompany } = req.user;
  const plan = req.body;
  const planCreated = await planService.addPlan(idCompany, plan);
  res.status(StatusCodes.OK).json(planCreated);
};

module.exports = {
  getPlan,
  addPlan,
};
