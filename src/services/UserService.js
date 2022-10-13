const { User, Role } = require('../models/index');
const { BadRequestError } = require('../errors');

class UserService {
  async getUsers(idCompany, page, rowsPerPage) {
    try {
      const { rows: data = [], count } = await User.findAndCountAll({
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        include: [
          {
            model: Role,
            as: 'roles',
          },
        ],
        where: {
          idCompany,
          active: true,
        },
        attributes: {
          exclude: ['password'],
        },
      });

      return { data, count };
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async getUserById(id) {
    try {
      const user = await User.findOne({
        where: { id, active: true },
        attributes: ['id', 'name', 'lastName', 'email', 'idCompany', 'active'],
        include: [
          {
            model: Role,
            as: 'roles',
          },
        ],
      });
      return user;
    } catch (e) {
      throw new BadRequestError(e.message);
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
      throw new BadRequestError(e.message);
    }
  }

  async addUser(idCompany, userDTO) {
    try {
      const user = await User.create({
        ...userDTO,
        idCompany,
      });
      return user;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = UserService;
