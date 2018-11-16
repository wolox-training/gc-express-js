const User = require('../models').User,
  errors = require('../errors'),
  jwt = require('../tools/jwtToken'),
  logger = require('../logger');

exports.userPost = (req, res, next) => {
  const createUser = User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    admin: req.body.admin
  });

  return createUser
    .then(user => {
      logger.info('Created user.');
      res.status(201).send({ user, message: 'Created user.' });
    })
    .catch(reason => {
      logger.error(`Database error - ${reason}`);
      next(errors.defaultError(`Database error - ${reason}`));
    });
};

exports.getUser = (req, res, next) => {
  const userFound = User.findById(req.params.id);

  return userFound
    .then(user => {
      logger.info('User found.');
      res.status(200).send({ user, message: 'User found.' });
    })
    .catch(reason => {
      logger.error(`Database error - ${reason}`);
      next(errors.defaultError(`Database error - ${reason}`));
    });
};

exports.generateToken = (req, res, next) => {
  return User.findOne({ where: { email: req.body.email } })
    .then(user => {
      if (user.password === req.body.password) {
        const token = jwt.createToken({ userId: user.id });
        const userWithToken = {
          id: user.id,
          email: user.email,
          password: user.password,
          firstName: user.firstName,
          lastName: user.lastName,
          sessionToken: token,
          admin: user.admin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        };

        logger.info('User authenticated.');
        res.status(200).send(userWithToken);
      } else {
        logger.info('Invalid user.');
        next(errors.defaultError(`Invalid user`));
      }
    })
    .catch(reason => {
      logger.error(`Database error - ${reason}`);
      next(errors.defaultError(`Database error - ${reason}`));
    });
};

exports.list = (req, res, next) => {
  User.findAndCountAll()
    .then(data => {
      const page = req.query.page && req.query.page >= 1 ? req.query.page : 1, // page number
        limit = req.query.limit && req.query.limit >= 0 ? req.query.limit : 3, // number of records per page
        pages = Math.ceil(data.count / limit),
        offset = limit * (page - 1);
      return User.findAll({
        limit,
        offset,
        order: [['id', 'ASC']]
      }).then(users => {
        logger.info('List of users');
        res.status(200).json({ result: users, count: data.count, pages });
      });
    })
    .catch(error => {
      logger.error(`Database error - ${error}`);
      next(errors.defaultError(`Database error - ${error}`));
    });
};

exports.admin = (req, res, next) => {
  return User.findOrCreate({
    where: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
      email: req.body.email,
      admin: false
    }
  })
    .spread((user, created) => {
      if (created) {
        user.update({ admin: true }).then(() => {
          logger.info('Admin created.');
          res.status(201).send(user);
        });
      } else if (user.admin === false) {
        user.update({ admin: true }).then(() => {
          logger.info('User updated to admin.');
          res.status(200).send(user);
        });
      } else {
        logger.error(`Invalid user`);
        next(errors.defaultError(`Invalid user`));
      }
    })
    .catch(reason => {
      logger.error(`Database error - ${reason}`);
      next(errors.defaultError(`Database error - ${reason}`));
    });
};
