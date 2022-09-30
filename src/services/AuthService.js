const { BadRequestError } = require('../errors');
const UserService = require('./UserService');

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
}

module.exports = AuthService;
