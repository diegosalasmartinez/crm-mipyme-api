const { StatusCodes } = require('http-status-codes');
const UserService = require('../services/UserService');
const userService = new UserService();

const getUsers = async (req, res) => {
  const { page = 0, rowsPerPage = 10 } = req.query;
  const { idCompany } = req.user;
  const { data, count } = await userService.getUsers(
    idCompany,
    page,
    rowsPerPage
  );
  res.status(StatusCodes.OK).json({ data, count });
};

module.exports = {
  getUsers,
};
