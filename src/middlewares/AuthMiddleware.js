const { UnauthenticatedError, AuthExpiredError } = require("../errors");
const AuthService = require("../services/AuthService");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('No tienes acceso a esta funcionalidad')
  }

  const authService = new AuthService();
  const token = authHeader.split(' ')[1]
  try {
    const payload = await authService.auth(token)
    req.user = {
      id: payload.userId,
      companyId: payload.companyId
    }
    next()
  } catch (error) {
    throw new AuthExpiredError('El tiempo de sesión terminó')
  }
}

module.exports = auth
