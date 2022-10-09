const jwt = require('jsonwebtoken');
const UserService = require('./UserService');
const { BadRequestError, AuthExpiredError } = require('../errors');

class AuthService {
  async login(email, password) {
    const userService = new UserService();
    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw new BadRequestError(`No existe el usuario con el correo ${email}`);
    }

    const passwordMatches = await user.comparePassword(password);
    if (!passwordMatches) {
      throw new BadRequestError('Credenciales inválidas');
    }

    const token = await user.createJWT();

    return { user, token };
  }

  async auth(token) {
    try {
      const userService = new UserService();
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      const user = await userService.getUserById(payload.userId);
      if (!user.active) {
        throw new AuthExpiredError('El usuario ya no está disponible');
      }
      return payload;
    } catch (error) {
      throw new AuthExpiredError('El tiempo de sesión terminó');
    }
  }
}

module.exports = AuthService;
