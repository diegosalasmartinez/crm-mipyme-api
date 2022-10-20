const { Role } = require('../models/index');
const { BadRequestError } = require('../errors');

class RoleService {
  async getRoles() {
    try {
      const roles = await Role.findAll({});
      return roles;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = RoleService;
