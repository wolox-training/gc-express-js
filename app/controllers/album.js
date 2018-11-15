const errors = require('../errors'),
  albumsService = require('../services/albums');

exports.list = (req, res, next) =>
  albumsService
    .getAlbums()
    .then(data => res.status(200).json(data))
    .catch(error => next(errors.defaultError(`Error - ${error}`)));
