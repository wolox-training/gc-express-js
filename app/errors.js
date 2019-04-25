const { GraphQLError } = require('graphql');

// It need to be string to work during testing
const createError = (message, status) => {
  const err = new GraphQLError(message);
  err.status = status;
  return err;
};
const DEFAULT_ERROR = 500,
  BAD_REQUEST = 400;

exports.defaultError = message => createError(message, DEFAULT_ERROR);
exports.badRequest = message => createError(message, BAD_REQUEST);

exports.invalidCountry = exports.badRequest('country header is invalid');
exports.missingHeader = headerName => exports.badRequest(`${headerName} header is missing`);

exports.missingImplementation = createError('Missing implementation', DEFAULT_ERROR);
