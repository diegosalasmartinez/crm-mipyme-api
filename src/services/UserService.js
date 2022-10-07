const { User } = require('../models/index');
const { BadRequestError } = require('../errors');

class UserService {
  async getUsers(companyId, page, rowsPerPage) {
    try {
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
    } catch (e) {
      throw new BadRequestError(e.message)
    }
  }

  async getUserById(id) {
    try {
      const user = await User.findOne({
        where: { id, active: true },
        attributes: ['id', 'companyId', 'active'],
      });
      return user;
    } catch (e) {
      throw new BadRequestError(e.message)
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await User.findOne({
        where: { email, active: true },
        attributes: ['id', 'companyId', 'name', 'lastName', 'password'],
      });
      return user;
    } catch (e) {
      throw new BadRequestError(e.message)
    }
  }
}

module.exports = UserService;
