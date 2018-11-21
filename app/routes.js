const users = require('./controllers/user'),
  albums = require('./controllers/album'),
  usersParameterValidator = require('./middlewares/usersValidator'),
  emailValidator = require('./middlewares/emailValidator'),
  tokenHeaderValidator = require('./middlewares/tokenHeaderValidator'),
  sessionParameterValidator = require('./middlewares/sessionParameterValidator');

exports.init = app => {
  app.post('/users', [usersParameterValidator.handle, emailValidator.handle], users.userPost);
  app.post('/getUser/:id', [], users.getUser);
  app.post('/users/sessions', [sessionParameterValidator.handle, emailValidator.handle], users.generateToken);
  app.get('/users', [tokenHeaderValidator.handle], users.list);
  app.post('/admin/users', [emailValidator.handle, tokenHeaderValidator.handle], users.admin);
  app.get('/albums', [tokenHeaderValidator.handle], albums.list);
  app.post('/albums/:id', [tokenHeaderValidator.handle], albums.buy);
};
