const AuthenticationMiddleware = require("./AuthMiddleware")
const ErrorHandlerMiddleware = require("./ErrorHandlerMiddleware")
const NotFoundMiddleware = require("./NotFoundMiddleware")

module.exports = {
  AuthenticationMiddleware,
  ErrorHandlerMiddleware,
  NotFoundMiddleware
}
