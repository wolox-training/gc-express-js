const errors = require('../errors'),
  albumsService = require('../services/albums'),
  logger = require('../logger');

exports.list = (req, res, next) =>
  albumsService
    .getAlbums()
    .then(data => {
      logger.info('Albums found.');
      res.status(200).json(data);
    })
    .catch(error => {
      logger.error(`Error - ${error}`);
      next(errors.defaultError(`Error - ${error}`));
    });
