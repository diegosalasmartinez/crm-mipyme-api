const jwt = require("jsonwebtoken")
const db = require("../db/models/index")
const { UnauthenticatedError } = require("../errors")

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('No tienes acceso a esta funcionalidad')
  }
  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    console.log(payload)
    const usuario = await db.Usuario.findOne({
      where: { id: payload.usuarioId },
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
    throw new UnauthenticatedError('No tienes acceso a esta funcionalidad')
  }
}

module.exports = auth
