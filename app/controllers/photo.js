const errors = require('../errors'),
  albumsService = require('../services/albums'),
  logger = require('../logger');

exports.list = (req, res, next) => {
  albumsService
    .getPhotosforPurchasedAlbum(req.body.id, req.params.id)
    .then(data => {
      logger.info(`Photos found!`);
      res.status(200).json(data);
    })
    .catch(error => {
      logger.error(`Database error - ${error}`);
      next(errors.defaultError(`Database error - ${error}`));
    });
};
