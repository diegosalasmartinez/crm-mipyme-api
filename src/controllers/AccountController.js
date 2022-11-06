const { StatusCodes } = require('http-status-codes');
const RoleService = require('../services/RoleService');
const roleService = new RoleService();
const MarketingKPIService = require('../services/MarketingKPIService');
const marketingKPIService = new MarketingKPIService();

const getAccount = async (req, res) => {
  const roles = await roleService.getRoles();
  const kpis = await marketingKPIService.getAll();
  res.status(StatusCodes.OK).json({ roles, kpis });
};

module.exports = {
  getAccount,
};
