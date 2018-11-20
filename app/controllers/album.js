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

exports.buy = (req, res, next) => {
  albumsService
    .findOrBuy(req.body.userId, req.params.id)
    .then(purchase => {
      logger.info('Albums purchased.');
      res.status(201).json(purchase);
    })
    .catch(error => {
      logger.error(`Error processing the purchase - ${error}`);
      next(errors.defaultError(`Error processing the purchase - ${error}`));
    });
};
