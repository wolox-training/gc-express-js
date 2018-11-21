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
  let promise;

  if (userId === undefined) {
    promise = Purchase.findAll();
  } else {
    promise = Purchase.findAll({ where: { userId } });
  }

  return promise.then(purchases => {
    if (purchases.length === 0) {
      throw new Error(`The user ${userId} does not have purchased albums`);
    }
    return purchases;
  });
};
