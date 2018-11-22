// Require the dev-dependencies
const _ = require('lodash'),
  chai = require('chai'),
  expect = require('chai').expect,
  chaiHttp = require('chai-http'),
  server = require('../../../app'),
  factory = require('factory-girl').factory,
  faker = require('faker'),
  mocks = require('../support/mocks'),
  jwt = require('../../../app/tools/jwtToken');

chai.use(chaiHttp);

describe.only('Controller: Album GET, `src/controller/album`', () => {
  let userTest = {};
  let userBuy = {};
  const token = jwt.createToken({ userId: 1 });
  const tokenBuy = jwt.createToken({ userId: 2 });

  beforeEach(done => {
    mocks.mockAlbums();
    mocks.mockPhotosForAlbumId(1);
    mocks.mockPhotosForAlbumId(2);

    factory.create('user').then(user => {
      user.reload();
      userTest = user.dataValues;
      userTest.sessionToken = token;
      userTest.admin = true;

      factory.create('user', { email: `${faker.internet.userName()}@wolox.com` }).then(user2 => {
        user2.reload();
        userBuy = user2.dataValues;
        userBuy.sessionToken = tokenBuy;

        factory.createMany('purchase', 2, [{ albumId: 1 }, { albumId: 2 }]).then(() => {
          done();
        });
      });
    });
  });

  context('When requesting photos', () => {
    it('should list photos album 1', done => {
      chai
        .request(server)
        .get('/users/albums/1/photos')
        .send(userBuy)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body.length).to.equal(2);
          expect(res.body[0].albumId).to.equal(1);
          expect(res.body[0].id).to.equal(1);
          expect(res.body[1].albumId).to.equal(1);
          expect(res.body[1].id).to.equal(2);
          done();
        });
    });
  });

  context('When requesting photos', () => {
    it('should list photos album 2', done => {
      chai
        .request(server)
        .get('/users/albums/2/photos')
        .send(userBuy)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body.length).to.equal(2);
          expect(res.body[0].albumId).to.equal(2);
          expect(res.body[0].id).to.equal(1);
          expect(res.body[1].albumId).to.equal(2);
          expect(res.body[1].id).to.equal(2);
          done();
        });
    });
  });

  context('When requesting photos without buying albums', () => {
    it('should return error message', done => {
      chai
        .request(server)
        .get('/users/albums/2/photos')
        .send(userTest)
        .then(res => {
          expect(res).to.have.status(500);
          expect(res.body.message).to.equal('Database error - Error: Album not purchased');
          done();
        });
    });
  });
});
