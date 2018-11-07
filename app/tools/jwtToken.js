const jwt = require('jsonwebtoken'),
  JWT_KEY = require('../constants').jwt_key,
  moment = require('moment');

const defaultExpiration = () => moment().add(moment.duration(parseInt(process.env.SESSION_EXP), 'seconds'));

exports.createToken = (payload, exp = defaultExpiration()) => {
  return jwt.sign({ data: payload, exp: exp.valueOf() }, JWT_KEY);
};
