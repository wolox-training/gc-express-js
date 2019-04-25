const logger = require('../logger');

const DEFAULT_STATUS_CODE = 500;

exports.handle = (graphqlError, res) => {
  const { message, status } = graphqlError.originalError || graphqlError;
  res.statusCode = status || DEFAULT_STATUS_CODE;
  logger.error(graphqlError.stack);
  return message || graphqlError.message;
};
