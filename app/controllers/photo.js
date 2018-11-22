const errors = require('../errors'),
  albumsService = require('../services/albums'),
  logger = require('../logger');

exports.list = (req, res, next) => {
  if (req.body.admin === false && req.body.id !== req.params.user_id) {
    logger.error(`User ${req.body.id} does not have access to another user photos.`);
    next(errors.defaultError(`User ${req.body.id} does not have access to another user photos.`));
  } else {
    albumsService
      .getPhotosforPurchasedAlbum(req.body.userId, req.params.id)
      .then(data => res.status(200).json(data))
      .catch(error => next(errors.defaultError(`Database error - ${error}`)));
  }
};
