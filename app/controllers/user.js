const User = require('../models').User,
  errors = require('../errors'),
  encode = require('hashcode').hashCode,
  jwt = require('../tools/jwtToken');

exports.userPost = (req, res, next) => {
  const createUser = User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password
  });

  return createUser
    .then(user => {
      res.status(201).send({ user, message: 'Created user.' });
    })
    .catch(reason => next(errors.defaultError(`Database error - ${reason}`)));
};

exports.getUser = (req, res, next) => {
  const userFound = User.findById(req.params.id);

  return userFound
    .then(user => {
      res.status(200).send({ user, message: 'User found.' });
    })
    .catch(reason => next(errors.defaultError(`Database error - ${reason}`)));
};

exports.generateToken = (req, res, next) => {
  return User.findOne({ where: { email: req.body.email } })
    .then(user => {
      const hashedPassword = encode().value(req.body.password);
      if (user.password === `${hashedPassword}`) {
        const token = jwt.createToken({ userId: user.id });
        const userWithToken = {
          email: user.email,
          password: user.password,
          firstName: user.firstName,
          lastName: user.lastName,
          sessionToken: token,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        };

        res.status(200).send(userWithToken);
      } else {
        next(
          errors.defaultError(
            `Error passwords: DB: ${user.password} VS Req: ${hashedPassword} - Invalid user`
          )
        );
      }
    })
    .catch(reason => next(errors.defaultError(`Database error - ${reason}`)));
};
