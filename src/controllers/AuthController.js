const db = require("../db/models/index")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError } = require("../errors")

const login = async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    throw new BadRequestError('Por favor, ingrese el usuario y contraseña')
  }
  const user = await db.Usuario.findOne({ where: { usuario: username }})
  if (!user) {
    throw new BadRequestError(`No existe el usuario ${username}`)
  }
  const correctPassword = await user.comparePassword(password)
  if (!correctPassword) {
    throw new BadRequestError('Credenciales inválidas')
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
