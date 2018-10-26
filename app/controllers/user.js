const User = require('../models').User;
const logger = require('../logger');

exports.userPost = (req, res) => {
  User.create(req.body)
    .then(user => {
      logger.info('User was created succesfully!');
    })
    .catch(err => {
      logger.error('User was not created. ', err.message);
      return res.status(422).send({ message: err.errors });
    });
};
