const jwt = require("jsonwebtoken")
const db = require("../db/models/index")
const { UnauthenticatedError } = require("../errors")

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Autenticación invalida')
  }
  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const usuario = await db.Usuario.findOne({
      where: { id: payload.userId },
      attributes: ['id', 'activo']
    })
    if (!usuario.activo) {
      throw new UnauthenticatedError('El usuario ya no está disponible')
    }
    req.usuario = {
      id: payload.usuarioId,
      empresaId: payload.empresaId
    }
    next();
  } catch (error) {
    throw new UnauthenticatedError('Autenticación invalida')
  }
}

module.exports = auth
