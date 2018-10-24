const dictum = require('dictum.js');

// For every endpoints
dictum.document({
  description: 'This endpoint allow add users to data base',
  endpoint: '/user/save',
  method: 'GET',
  requestHeaders: {
    /* headers for endpoint */
  },
  requestPathParams: {
    /* path params for endpoint */
  },
  requestBodyParams: {
    /* body params for endpoint */
  },
  responseStatus: 200,
  responseHeaders: {
    /* headers for response */
  },
  responseBody: {
    /* body params for response */
  },
  resource: 'My Resource'
});
