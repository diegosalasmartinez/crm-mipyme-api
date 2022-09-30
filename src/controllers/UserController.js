const UserService = require("../services/UserService")

const getUsers = async (req, res) => {
  const userService = new UserService();
  const { page = 0, rowsPerPage = 10 } = req.query
  const users = await userService.getUsers(page, rowsPerPage)
  const count = await userService.countUsers()
  res.status(200).json({ data: users, count })
}

module.exports = {
  getUsers,
}
