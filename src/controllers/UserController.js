const { StatusCodes } = require('http-status-codes');
const UserService = require('../services/UserService');
const userService = new UserService();

const getUsers = async (req, res) => {
  const { page, rowsPerPage } = req.query;
  const { idCompany } = req.user;
  const { data, count } = await userService.getUsers(idCompany, page, rowsPerPage);
  res.status(StatusCodes.OK).json({ data, count });
};

const getUserById = async (req, res) => {
  const { idUser } = req.params;
  const user = await userService.getUserById(idUser);
  res.status(StatusCodes.OK).json(user);
};

const addUser = async (req, res) => {
  const { idCompany } = req.user;
  const user = req.body;
  await userService.addUser(idCompany, user);
  res.status(StatusCodes.OK).json({ message: `El usuario ${user.name} ha sido registrado` });
};

const getProfile = async (req, res) => {
  const { id: idUser } = req.user;
  const user = await userService.getUserProfile(idUser);
  res.status(StatusCodes.OK).json(user);
};

module.exports = {
  getUsers,
  getUserById,
  addUser,
  getProfile
};
