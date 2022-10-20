const { StatusCodes } = require('http-status-codes');
const RoleService = require('../services/RoleService');
const roleService = new RoleService();

const getRoles = async (req, res) => {
  const roles = await roleService.getRoles();
  res.status(StatusCodes.OK).json(roles);
};

module.exports = {
  getRoles,
};
