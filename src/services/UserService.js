const { User, Role, sequelize } = require('../models/index');
const RoleService = require('./RoleService');
const { BadRequestError } = require('../errors');

class UserService {
  async getUsers(idCompany, page = 0, rowsPerPage = 10) {
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

  async getAllUsers(idCompany) {
    try {
      const users = await User.findAll({
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

      return users;
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

  async addAdminUser(idCompany, userDTO, t) {
    try {
      const userBulk = User.build({
        name: userDTO.name,
        lastName: userDTO.lastName,
        email: userDTO.email,
        password: userDTO.password,
        idCompany: idCompany,
      });
      await userBulk.setPassword();
      const user = await userBulk.save({ transaction: t });

      const roleService = new RoleService();
      const roles = await roleService.getRoles();
      await user.addRole(roles[0], { transaction: t });

      return user;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  async addUser(idCompany, userDTO) {
    const t = await sequelize.transaction();

    try {
      const userBulk = User.build({
        name: userDTO.name,
        lastName: userDTO.lastName,
        email: userDTO.email,
        password: userDTO.password,
        idCompany: idCompany,
      });
      await userBulk.setPassword();
      const user = await userBulk.save({ transaction: t });

      if (userDTO.rolesId && userDTO.rolesId.length > 0) {
        await this.addUserRole(user, userDTO.rolesId, t);
      }

      await t.commit();

      return user;
    } catch (e) {
      await t.rollback();
      throw new BadRequestError(e.message);
    }
  }

  async addUserRole(user, rolesId = [], t) {
    try {
      for (const idRole of rolesId) {
        await user.addRole(idRole, { transaction: t });
      }
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = UserService;
