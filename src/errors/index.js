const BadRequestError = require('./BadRequestError');
const NotFoundError = require('./NotFoundError');
const UnauthenticatedError = require('./UnauthenticatedError');
const AuthExpiredError = require('./AuthExpiredError');

module.exports = {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
  AuthExpiredError,
};
