const errors = require('../errors');

const hasAllParameters = body => {
  return typeof body.email !== 'undefined' && typeof body.password !== 'undefined';
};

exports.handle = (req, res, next) => {
  if (!hasAllParameters(req.body)) {
    next(errors.defaultError('Missing parameters!'));
    return;
  }

  next();
};
