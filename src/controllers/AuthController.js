const { StatusCodes } = require("http-status-codes")
const db = require("../db/models/index")
const { BadRequestError, UnauthenticatedError } = require("../errors")

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new BadRequestError('Please provide an username and password')
  }
  const user = await db.Usuario.findOne({ where: { usuario: username }})
  if (!user) {
    throw new UnauthenticatedError(`No existe el usuario ${username}`)
  }
  const correctPassword = await user.comparePassword(password)
  if (!correctPassword) {
    throw new UnauthenticatedError('Credenciales inválidas')
  }

  const token = user.createJWT()
  const userResponse = {
    id: user.id,
    nombre: user.getFullName()
  }
  res.status(StatusCodes.OK).json({ usuario: userResponse, token })
}

module.exports = {
  login
}
