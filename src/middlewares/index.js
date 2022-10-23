const authenticationMiddleware = require('./AuthMiddleware');
const errorHandlerMiddleware = require('./ErrorHandlerMiddleware');
const notFoundMiddleware = require('./NotFoundMiddleware');

module.exports = {
  authenticationMiddleware,
  errorHandlerMiddleware,
  notFoundMiddleware,
};
