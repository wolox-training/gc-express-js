const request = require('request-promise'),
  jsonplaceholder = 'https://jsonplaceholder.typicode.com/',
  Purchase = require('../models').purchase,
  logger = require('../logger');

exports.getAlbums = () =>
  request({
    method: 'GET',
    uri: `${jsonplaceholder}albums`,
    json: true
  });

exports.findOrBuy = (userId, albumId) =>
  Purchase.findAll({ where: { userId, albumId } }).then(purchases => {
    if (purchases.length > 0) {
      throw new Error(`Album ${albumId} was already purchased by user ${userId}`);
    }
    return Purchase.create({ userId, albumId });
  });

exports.findAll = userId => Purchase.findAll({ where: { userId } });

exports.getPhotosforPurchasedAlbum = (userId, albumId) =>
  Purchase.findOne({ where: { userId, albumId } })
    .then(purchase => {
      if (!purchase) throw new Error('Album not purchased');
      return purchase.albumId;
    })
    .then(() => {
      logger.info(
        `Requering album ${albumId} of user ${userId} to ${jsonplaceholder}albums/${albumId}/photos`
      );
      return request({
        method: 'GET',
        uri: `${jsonplaceholder}albums/${albumId}/photos`,
        json: true
      });
    });
