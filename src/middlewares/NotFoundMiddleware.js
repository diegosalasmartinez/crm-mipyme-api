const notFoundMiddleware = (req, res) =>
  res.status(404).json({ message: "El servicio no existe." })

module.exports = notFoundMiddleware
