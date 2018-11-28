const errors = require('../errors'),
  jwt = require('jsonwebtoken'),
  JWT_KEY = require('../constants').jwt_key,
  moment = require('moment');

exports.handle = (req, res, next) => {
  jwt.verify(`${req.body.sessionToken}`, JWT_KEY, (jwtError, decoded) => {
    if (jwtError && jwtError.message === 'jwt malformed') {
      next(errors.defaultError('Invalid token!'));
    } else if (decoded.data.expiresIn && decoded.data.expiresIn <= moment().valueOf()) {
      next(errors.defaultError('Expired token!'));
    }
  });

  next();
};
