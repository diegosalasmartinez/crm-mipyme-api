const { sequelize } = require('../models/index');
const jwt = require('jsonwebtoken');
const UserService = require('./UserService');
const { BadRequestError, AuthExpiredError } = require('../errors');
const CompanyService = require('./CompanyService');

class AuthService {
  async login(email, password) {
    const userService = new UserService();
    console.log(email, password)
    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw new BadRequestError(`No existe el usuario con el correo ${email}`);
    }

    const passwordMatches = await user.comparePassword(password);
    if (!passwordMatches) {
      throw new BadRequestError('Credenciales inválidas');
    }
    const token = jwt.sign({ idUser: user.id, idCompany: user.idCompany, roles: user.roles }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_LIFETIME,
    });
    return { user, token };
  }

  async auth(token) {
    try {
      const userService = new UserService();
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      const user = await userService.getUserById(payload.idUser);
      if (!user.active) {
        throw new AuthExpiredError('El usuario ya no está disponible');
      }
      return payload;
    } catch (error) {
      throw new AuthExpiredError('El tiempo de sesión terminó');
    }
  }

  async registerAccount(companyDTO, userDTO) {
    const t = await sequelize.transaction();
    try {
      const companyService = new CompanyService();
      const company = await companyService.addCompany(companyDTO, t);

      const userService = new UserService();
      const user = await userService.addAdminUser(company.id, userDTO, t);

      await t.commit();

      return user;
    } catch (e) {
      await t.rollback();
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = AuthService;
