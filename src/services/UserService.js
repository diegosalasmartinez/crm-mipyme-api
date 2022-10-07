const { User } = require('../models/index');

class UserService {
  async getUsers(companyId, page, rowsPerPage) {
    const users = await User.findAll({
      offset: page * rowsPerPage,
      limit: rowsPerPage,
      where: {
        companyId,
        active: true,
      },
      attributes: {
        exclude: ['password'],
      },
    });
    const count = await User.count({
      where: {
        companyId,
        active: true,
      },
    });
    return { users, count };
  }

  async getUserById(id) {
    const user = await User.findOne({
      where: { id, active: true },
      attributes: ['id', 'companyId', 'active'],
    });
    return user;
  }

  async getUserByEmail(email) {
    const user = await User.findOne({
      where: { email, active: true },
      attributes: ['id', 'companyId', 'name', 'lastName', 'password'],
    });
    return user;
  }
}

module.exports = UserService;
