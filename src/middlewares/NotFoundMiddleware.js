const { StatusCodes } = require("http-status-codes")

const notFoundMiddleware = (req, res) =>
  res.status(StatusCodes.NOT_FOUND).json({ message: "El servicio no existe." })

module.exports = notFoundMiddleware
