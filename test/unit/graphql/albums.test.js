const app = require('./../../../app'),
  rpMock = require('request-promise'),
  mocks = require('./mocks'),
  { simpleAlbum } = require('./queries'),
  expect = require('chai').expect,
  request = require('supertest');

// jest.mock('request-promise');

describe('Albums', () => {
  describe('queries', () => {
    describe('simple album', () => {
      it('should get basic album information', done => {
        // rpMock.mockResolvedValueOnce(mocks.simpleAlbum);

        request(app)
          .get('/albums')
          .send({ query: simpleAlbum.query })
          .expect(200)
          .then(response => {
            console.log(response);
            // expect(response.body).toEqual(basicOrder.response);
          })
          .then(() => done());
      });
    });
  });
});
