const errors = require('../errors'),
  albumsService = require('../services/albums'),
  logger = require('../logger');

exports.list = (req, res, next) => {
  logger.info(`Requering album ${req.params.id} of user ${req.body.id}`);
  albumsService
    .getPhotosforPurchasedAlbum(req.body.id, req.params.id)
    .then(data => {
      logger.info(`Photos found!`);
      res.status(200).json(data);
    })
    .catch(error => {
      logger.error(`Photos not found - ${error}`);
      next(errors.defaultError(`Photos not found - ${error}`));
    });
};
