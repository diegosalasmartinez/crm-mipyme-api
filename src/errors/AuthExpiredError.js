const CustomAPIError = require("./CustomAPIError")
const { StatusCodes } = require("http-status-codes")

class AuthExpiredError extends CustomAPIError {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.FORBIDDEN
  }
}

module.exports = AuthExpiredError
