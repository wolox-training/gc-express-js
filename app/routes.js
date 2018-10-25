const controller = require('./controllers/user');

exports.init = app => {
  app.post('/users', [], controller.userPost);
};
