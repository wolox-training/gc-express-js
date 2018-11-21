const request = require('request-promise'),
  jsonplaceholder = 'https://jsonplaceholder.typicode.com/',
  User = require('../models').User,
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
