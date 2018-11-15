const errors = require('../errors'),
  albumsService = require('../services/albums');

exports.list = (req, res, next) =>
  albumsService
    .getAlbums()
    .then(data => res.status(200).json(data))
    .catch(error => next(errors.defaultError(`Error - ${error}`)));

exports.buy = (req, res, next) =>
  albumsService
    .findOrBuy(req.body.token_data.user_id, req.params.id)
    .then(purchase => res.status(201).json(purchase))
    .catch(error => {
      next(errors.defaultError(`Error processing the purchase - ${error}`));
    });
