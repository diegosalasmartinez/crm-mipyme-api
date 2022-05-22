// const User = require('../models/UserModel')
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, UnauthenticatedError } = require("../errors")

const login = async (req, res) => {
  // const { username, password } = req.body;
  // if (!username || !password) {
  //     throw new BadRequestError('Please provide an username and password');
  // }
  // const user = await User.findOne({username});
  // if (!user) {
  //     throw new UnauthenticatedError('User doesn\'t exist');
  // }
  // const correctPassword = await user.comparePassword(password);
  // if (!correctPassword) {
  //     throw new UnauthenticatedError('Username or password did not match');
  // }
  // const token = user.createJWT();
  // const userResponse = {
  //     _id: user._id,
  //     name: user.name,
  //     lastName: user.lastName,
  //     username: user.username
  // }
  // res.status(StatusCodes.OK).json({user: userResponse, token});
}

const register = async (req, res) => {
  // const newUser = new User({
  //     name: req.body.name,
  //     lastName: req.body.lastName,
  //     username: req.body.username,
  //     password: req.body.password,
  //     email: req.body.email,
  //     birthday: req.body.birthday
  // })
  // const user = await newUser.save();
  // const token = user.createJWT();
  // const userResponse = {
  //     _id: user._id,
  //     name: user.name,
  //     lastName: user.lastName,
  //     username: user.username
  // }
  // res.status(StatusCodes.OK).json({user: userResponse, token});
}

module.exports = {
  login,
  register
}
