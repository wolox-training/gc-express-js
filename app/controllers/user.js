const User = require('../models').User,
  errors = require('../errors');

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
