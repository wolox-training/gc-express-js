const dictum = require('dictum.js');

// For every endpoints
dictum.document({
  description: 'This endpoint allow add users to data base',
  endpoint: '/user/save',
  method: 'GET',
  requestHeaders: {},
  requestPathParams: {},
  requestBodyParams: {},
  responseStatus: 200,
  responseHeaders: {},
  responseBody: {},
  resource: 'My Resource'
});
