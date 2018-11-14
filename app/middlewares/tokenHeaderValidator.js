const errors = require('../errors'),
  jwt = require('jsonwebtoken'),
  JWT_KEY = require('../constants').jwt_key;

exports.handle = (req, res, next) => {
  jwt.verify(`${req.body.sessionToken}`, JWT_KEY, (jwtError, decoded) => {
    if (jwtError) {
      next(errors.defaultError('Invalid token!'));
    }
  });

  next();
};
