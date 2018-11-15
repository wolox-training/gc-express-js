// Require the dev-dependencies
const _ = require('lodash'),
  chai = require('chai'),
  expect = require('chai').expect,
  chaiHttp = require('chai-http'),
  server = require('../../../app'),
  factory = require('factory-girl').factory,
  mocks = require('../support/mocks');

chai.use(chaiHttp);

describe.only('Controller: Album GET, `src/controller/album`', () => {
  let userTest = {};

  beforeEach(done => {
    mocks.mockAlbums();
    factory.create('user').then(user => {
      user.reload();
      userTest = user.dataValues;
      done();
    });
  });

  context('When requesting with a valid token', () => {
    it('should return the albums', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send(userTest)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).have.property('sessionToken');
          chai
            .request(server)
            .get('/albums')
            .send(res.body)
            .then(response => {
              expect(response).to.have.status(200);
              expect(response.body.length).to.equal(2);
              done();
            });
        });
    });
  });

  context('When requesting with an invalid token', () => {
    it('should return invalid token message', done => {
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
