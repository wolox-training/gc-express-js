const errors = require('../errors');

exports.handle = (req, res, next) => {
  // Validate fields
  if (typeof req.headers.sessionToken === 'undefined') {
    next(errors.defaultError('Missing token!'));
  }

  next();
};
