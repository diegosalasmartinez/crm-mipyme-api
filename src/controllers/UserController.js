const { StatusCodes } = require("http-status-codes");
const UserService = require("../services/UserService")

const getUsers = async (req, res) => {
  const { page = 0, rowsPerPage = 10 } = req.query
  const { companyId } = req.user
  const userService = new UserService();
  const { users, count } = await userService.getUsers(companyId, page, rowsPerPage)
  res.status(StatusCodes.OK).json({ data: users, count })
}

module.exports = {
  getUsers,
}
