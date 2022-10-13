const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');
const AuthService = require('../services/AuthService');
const authService = new AuthService()

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Por favor, ingrese el correo y contraseña');
  }
  
  const { user, token } = await authService.login(email, password)
  const response = {
    id: user.id,
    fullName: user.getFullName(),
    roles: []
  };
  res.status(StatusCodes.OK).json({ usuario: response, token });
};

const register = async (req, res) => {
  const { company, user } = req.body;
  const userCreated = await authService.registerAccount(company, user);
  res.status(StatusCodes.OK).json(userCreated);
};

module.exports = {
  login,
  register,
};
