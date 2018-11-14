const users = require('./controllers/user'),
  usersParameterValidator = require('./middlewares/usersValidator'),
  emailValidator = require('./middlewares/emailValidator'),
  sessionParameterValidator = require('./middlewares/sessionParameterValidator');

exports.init = app => {
  app.post('/users', [usersParameterValidator.handle, emailValidator.handle], users.userPost);
  app.post('/getUser/:id', [], users.getUser);
  app.post('/users/sessions', [sessionParameterValidator.handle, emailValidator.handle], users.generateToken);
};
