// Require the dev-dependencies
const _ = require('lodash'),
  chai = require('chai'),
  expect = require('chai').expect,
  chaiHttp = require('chai-http'),
  server = require('../../../app'),
  factory = require('factory-girl').factory,
  mocks = require('../support/mocks'),
  jwt = require('../../../app/tools/jwtToken');

chai.use(chaiHttp);

describe.only('Controller: Album GET, `src/controller/album`', () => {
  let userTest = {};
  const token = jwt.createToken({ userId: 1 });

  beforeEach(done => {
    mocks.mockAlbums();
    factory.create('user').then(user => {
      user.reload();
      userTest = user.dataValues;
      userTest.sessionToken = token;
      done();
    });
  });

  context('When requesting with a valid token', () => {
    it('should return the albums', done => {
      chai
        .request(server)
        .get('/albums')
        .send(userTest)
        .then(response => {
          expect(response).to.have.status(200);
          expect(response.body.length).to.equal(2);
          done();
        });
    });
  });

  context('When requesting with an invalid token', () => {
    it('should return invalid token message', done => {
      userTest.sessionToken = 'invalid token';
      chai
        .request(server)
        .get('/albums')
        .send(userTest)
        .then(res => {
          expect(res).to.have.status(500);
          expect(res.body.message).to.equal('Invalid token!');
          done();
        });
    });
  });
});
