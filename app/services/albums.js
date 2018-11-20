const request = require('request-promise'),
  jsonplaceholder = 'https://jsonplaceholder.typicode.com/';

exports.getAlbums = () =>
  request({
    method: 'GET',
    uri: `${jsonplaceholder}albums`,
    json: true
  });
