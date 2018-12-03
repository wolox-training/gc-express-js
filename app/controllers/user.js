const User = require('../models').User,
  errors = require('../errors'),
  jwt = require('../tools/jwtToken'),
  logger = require('../logger'),
  expirationTime = process.env.SESSION_EXP,
  moment = require('moment');

exports.userPost = (req, res, next) => {
  const createUser = User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    admin: req.body.admin,
    isActive: false
  });

  return createUser
    .then(user => {
      logger.info(`Created user ${user.firstName} ${user.lastName}.`);
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
      logger.info(`User ${user.firstName} ${user.lastName} found.`);
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
        const token = jwt.createToken({
          userId: user.id,
          expiresIn: moment()
            .add(expirationTime, 'second')
            .valueOf()
        });
        const userWithToken = {
          id: user.id,
          email: user.email,
          password: user.password,
          firstName: user.firstName,
          lastName: user.lastName,
          sessionToken: token,
          admin: user.admin
        };

        user.update({ isActive: true }).then(() => {
          logger.info(
            `User ${user.firstName} ${user.lastName} authenticated. Expiration time: ${expirationTime}.`
          );
          res.status(200).send(userWithToken);
        });
      } else {
        logger.error('Invalid user.');
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
          logger.info(`Admin ${user.firstName} ${user.lastName} created.`);
          res.status(201).send(user);
        });
      } else if (user.admin === false) {
        user.update({ admin: true }).then(() => {
          logger.info(`User ${user.firstName} ${user.lastName} updated to admin.`);
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

exports.invalidateAuthToken = (req, res, next) => {
  return User.findOne({ where: { email: req.body.email } })
    .then(user => {
      user.update({ isActive: false }).then(() => {
        logger.info(`${user.email} was invalidated.`);
        res.status(200).send({ user, message: `${user.email} was invalidated.` });
      });
    })
    .catch(reason => {
      logger.error(`Database error - ${reason}`);
      next(errors.defaultError(`Database error - ${reason}`));
    });
};
