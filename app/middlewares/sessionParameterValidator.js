const errors = require('../errors');

const hasAllParameters = body => {
  return typeof body.email !== 'undefined' && typeof body.password !== 'undefined';
};

exports.handle = (req, res, next) => {
  console.log(req.body);
  if (!hasAllParameters(req.body)) {
    next(errors.defaultError('Missing parameters!'));
  }

  next();
};
