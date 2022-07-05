const db = require("../db/models/index")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError } = require("../errors")

const login = async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    throw new BadRequestError('Por favor, ingrese el usuario y contraseña')
  }
  const usuario = await db.Usuario.findOne({
    where: { usuario: username },
    attributes: ['id', 'nombre', 'apePaterno', 'apeMaterno', 'password']
  })
  if (!usuario) {
    throw new BadRequestError(`No existe el usuario ${username}`)
  }
  const correctPassword = await usuario.comparePassword(password)
  if (!correctPassword) {
    throw new BadRequestError('Credenciales inválidas')
  }
  const empresaUsuario = await usuario.getEmpresaUsuario()
  const token = usuario.createJWT(empresaUsuario.empresaId)
  const response = {
    id: usuario.id,
    empresaId: empresaUsuario.empresaId,
    nombre: usuario.getFullName()
  }
  res.status(StatusCodes.OK).json({ usuario: response, token })
}

module.exports = {
  login
}
