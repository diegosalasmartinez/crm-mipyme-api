const { StatusCodes } = require('http-status-codes');

class AuthExpiredError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = AuthExpiredError;
