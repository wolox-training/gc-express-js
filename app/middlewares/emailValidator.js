const errors = require('../errors'),
  User = require('../models').User;

const isValidMail = mail => {
  const re = /^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(wolox)\.com$/g;
  return re.test(mail);
};

exports.handle = (req, res, next) => {
  // Validate email domain
  if (!isValidMail(req.body.email)) {
    next(errors.defaultError('Invalid email!'));
  }
  next();
};
