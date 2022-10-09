const { User } = require('../models/index');
const { BadRequestError } = require('../errors');

class UserService {
  async getUsers(idCompany, page, rowsPerPage) {
    try {
      const users = await User.findAll({
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        where: {
          idCompany,
          active: true,
        },
        attributes: {
          exclude: ['password'],
        },
      });
      const count = await User.count({
        where: {
          idCompany,
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
        attributes: ['id', 'name', 'lastName', 'email', 'idCompany', 'active'],
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
        attributes: ['id', 'idCompany', 'name', 'lastName', 'password'],
      });
      return user;
    } catch (e) {
      throw new BadRequestError(e.message)
    }
  }
}

module.exports = UserService;
