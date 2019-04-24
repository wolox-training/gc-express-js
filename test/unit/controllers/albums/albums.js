const app = require('../../../../app'),
  rpMock = require('request-promise'),
  mocks = require('../../support/mocks'),
  { getAllAlbums } = require('./queries'),
  request = require('supertest');

describe.only('Orders', () => {
  describe('queries', () => {
    describe('Albums', () => {
      it('should return all albums', done => {
        // rpMock.mockResolvedValueOnce(mocks.albums);
        request(app)
          .get('/')
          .send({ query: getAllAlbums.query })
          .then(response => {
            console.log(response);
            done();
          });
      });
    });
  });
});
