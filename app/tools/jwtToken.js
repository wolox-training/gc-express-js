const jwt = require('jsonwebtoken'),
  JWT_KEY = require('../constants').jwt_key,
  moment = require('moment');

const defaultExpiration = () => moment().add(moment.duration(parseInt(process.env.SESSION_EXP), 'seconds'));

exports.createToken = (payload, exp = defaultExpiration()) => {
  return jwt.sign({ data: payload, exp: exp.valueOf() }, JWT_KEY);
};

exports.verifyToken = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_KEY, (jwtError, decoded) => {
      if (decoded) {
        resolve({ value: decoded });
      } else {
        reject(jwtError);
      }
    });
  });
};

exports.veryfyExpiration = (payload, comparisonTimestamp = moment()) => {
  return new Promise((resolve, reject) => {
    if (!payload.value) {
      if (payload.error) {
        resolve(payload);
      } else {
        reject('Unknown error');
      }
      return;
    }
    if (comparisonTimestamp.isAfter(moment(payload.value.exp || 0))) {
      resolve({ error: `Expired token - exp: ${payload.value.exp}` });
    } else {
      resolve({ value: payload.value.data });
    }
  });
};
