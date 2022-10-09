const CompanyService = require('../services/CompanyService');
const AuthService = require('../services/AuthService');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Por favor, ingrese el correo y contraseña');
  }
  
  const userService = new AuthService()
  const { user, token } = await userService.login(email, password)
  const response = {
    id: user.id,
    fullName: user.getFullName(),
  };
  res.status(StatusCodes.OK).json({ usuario: response, token });
};

const register = async (req, res) => {
  const companyService = new CompanyService();
  const { company, user } = req.body;
  const userCreated = await companyService.registerCompanyAccount(company, user);
  res.status(StatusCodes.OK).json(userCreated);
};

module.exports = {
  login,
  register,
};
