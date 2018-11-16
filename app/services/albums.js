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
  return Purchase.findAll({ where: { album_id: albumId } })
    .then(purchases => {
      console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
      if (purchases.length > 0) {
        throw new Error(`Album ${albumId} has already being bought by User ${userId}`);
      }
      return Purchase.create({ userId, albumId });
    })
    .then(purchase => {
      return User.findById(userId)
        .then(user => user.addPurchases([purchase]))
        .then(() => purchase);
    })
    .then(purchase => purchase.reload());
};
