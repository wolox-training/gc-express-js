const errors = require('../errors'),
  albumsService = require('../services/albums'),
  User = require('../models').User,
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
    .findOrBuy(req.body.id, req.params.id)
    .then(purchase => {
      logger.info(`Album ${purchase.dataValues.albumId} purchased.`);
      res.status(201).json(purchase);
    })
    .catch(error => {
      logger.error(`Error processing the purchase - ${error}`);
      next(errors.defaultError(`Error processing the purchase - ${error}`));
    });
};

exports.listAll = (req, res, next) => {
  if (req.body.admin === false && req.body.id !== req.params.user_id) {
    logger.error(`User ${req.body.id} does not have access to another user purchases.`);
    next(errors.defaultError(`User ${req.body.id} does not have access to another user purchases.`));
  } else {
    albumsService
      .findAll(req.params.user_id)
      .then(purchases => {
        logger.info('Albums list.');
        res.status(200).json(purchases);
      })
      .catch(error => {
        logger.error(`Error - ${error}`);
        next(errors.defaultError(`Error - ${error}`));
      });
  }
};
