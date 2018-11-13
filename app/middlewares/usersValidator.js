const errors = require('../errors'),
  bcrypt = require('bcryptjs');

const missingParams = (data, ...params) => {
  return params.filter(p => !data[p]);
};

const isValidPassword = password => {
  const re = /^[a-zA-Z0-9]*$/;
  return re.test(password);
};

exports.handle = (req, res, next) => {
  // Validate fields
  const params = missingParams(req.body, 'email', 'password', 'firstName', 'lastName');
  if (!Array.isArray(params) || params.length) {
    next(errors.defaultError(`Missing parameters: ${params}`));
  }

  // Validate password
  if (
    !isValidPassword(req.body.password) ||
    (req.body.password.length < 8 || req.body.password.length > 50)
  ) {
    next(errors.defaultError('Invalid password!'));
  }

  next();
};
