const User = require('../models').User,
  errors = require('../errors'),
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
      if (user.password === req.body.password) {
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
        next(errors.defaultError(`Invalid user`));
      }
    })
    .catch(reason => next(errors.defaultError(`Database error - ${reason}`)));
};

exports.list = (req, res, next) => {
  User.findAndCountAll()
    .then(data => {
      const page = req.query.page && req.query.page >= 1 ? req.query.page : 1, // page number
        limit = req.query.limit && req.query.limit >= 0 ? req.query.limit : 3, // number of records per page
        pages = Math.ceil(data.count / limit),
        offset = limit * (page - 1);
      return User.findAll({ limit, offset, order: [['id', 'ASC']] }).then(users => {
        res.status(200).json({ result: users, count: data.count, pages });
      });
    })
    .catch(error => {
      next(errors.defaultError(`Database error - ${error}`));
    });
};
