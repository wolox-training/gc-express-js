const User = require('../models/user');

exports.userPost = (req, res) => {
    Model.sequelize.sync().then(function(){
      Model.User.create(req.body)
      .then(user => {
        logger.info('User was created succesfully!');
      }).catch(err => {
          logger.error('User was not created. ', err.message);
          return res.status(422).send({ message : map (err.errors, 'message') });
      });
    });
};