const request = require('request-promise'),
  jsonplaceholder = 'https://jsonplaceholder.typicode.com/',
  Purchase = require('../models').purchase;

exports.getAlbums = () =>
  request({
    method: 'GET',
    uri: `${jsonplaceholder}albums`,
    json: true
  });

exports.findOrBuy = (userId, albumId) => {
  return Purchase.findAll({ where: { userId, albumId } }).then(purchases => {
    if (purchases.length > 0) {
      throw new Error(`Album ${albumId} was already purchased by user ${userId}`);
    }
    return Purchase.create({ userId, albumId });
  });
};

exports.findAll = userId => {
  return Purchase.findAll({ where: { userId } }).then(purchases => {
    return purchases;
  });
};

exports.getPhotosforPurchasedAlbum = (userId, albumId) => {
  return Purchase.findOne({ where: { userId, albumId } })
    .then(purchase => {
      if (!purchase) throw new Error('Album not purchased');
      return purchase.albumId;
    })
    .then(() => {
      return request({
        method: 'GET',
        uri: `${jsonplaceholder}albums/${albumId}/photos`,
        json: true
      });
    })
    .then(photos => {
      return photos;
    });
};
