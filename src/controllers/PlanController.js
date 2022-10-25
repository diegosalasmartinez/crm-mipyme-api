const { StatusCodes } = require('http-status-codes');
const PlanService = require('../services/PlanService');
const planService = new PlanService();

const getPlan = async (req, res) => {
  const { idCompany } = req.user;
  const plan = await planService.getPlan(idCompany);
  let stats = {} 
  if (plan) {
    stats = await planService.getPlanStats(plan);
  }
  res.status(StatusCodes.OK).json({ plan, stats });
};

const addPlan = async (req, res) => {
  const { idCompany } = req.user;
  const plan = req.body;
  const planCreated = await planService.addPlan(idCompany, plan);
  res.status(StatusCodes.OK).json(planCreated);
};

const dashboard = async (req, res) => {
  const { idCompany } = req.user;
  const stats = await planService.dashboard(idCompany);
  res.status(StatusCodes.OK).json(stats);
}

module.exports = {
  getPlan,
  addPlan,
  dashboard
};
