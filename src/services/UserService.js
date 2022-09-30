const { User } = require('../models/index');

class UserService {
  async getUsers(page, rowsPerPage) {
    const users = await User.findAll({
      offset: page * rowsPerPage,
      limit: rowsPerPage,
      where: {
        active: true,
      },
      attributes: {
        exclude: ['password'],
      },
    });
    return users;
  }

  async getUserByEmail(email) {
    const user = await User.findOne({
      where: { email, active: true },
      attributes: ['id', 'name', 'lastName', 'password'],
    });
    return user;
  }

  async countUsers() {
    const count = await User.count({
      where: {
        active: true,
      },
    });
    return count;
  }
}

module.exports = UserService;
