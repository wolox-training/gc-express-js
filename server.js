const app = require('./app'),
  Rollbar = require('rollbar'),
  migrationsManager = require('./migrations'),
  config = require('./config'),
  logger = require('./app/logger'),
  schema = require('./app/graphql'),
  graphqlHTTP = require('express-graphql'),
  errorHandler = require('./app/middlewares/errors');

const port = config.common.port || 8080;

migrationsManager
  .check()
  .then(() => {
    const rollbar = new Rollbar({
      accessToken: config.common.rollbar.accessToken,
      enabled: !!config.common.rollbar.accessToken,
      environment: config.common.rollbar.environment || config.environment
    });
    app.use(rollbar.errorHandler());

    app.use(
      '/',
      graphqlHTTP((_, res) => ({
        schema,
        graphiql: config.isDevelopment,
        formatError: err => errorHandler.handle(err, res)
      }))
    );

    app.listen(port);

    logger.info(`Listening on port: ${port}`);
  })
  .catch(logger.error);
