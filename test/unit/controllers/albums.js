/* eslint-disable mocha/no-identical-title */
// Require the dev-dependencies
const _ = require('lodash'),
  chai = require('chai'),
  expect = require('chai').expect,
  chaiHttp = require('chai-http'),
  server = require('../../../app'),
  factory = require('factory-girl').factory,
  faker = require('faker'),
  mocks = require('../support/mocks'),
  Purchase = require('../../../app/models').purchase,
  jwt = require('../../../app/tools/jwtToken'),
  moment = require('moment'),
  expirationTime = process.env.SESSION_EXP;

chai.use(chaiHttp);

describe('Controller: Album GET, `src/controller/album`', () => {
  let userTest = {};
  const token = jwt.createToken({
    userId: 1,
    expiresIn: moment()
      .add(expirationTime, 'second')
      .valueOf()
  });

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

describe('Controller: Album POST, `src/controller/album`', () => {
  let userTest = {};
  const token = jwt.createToken({
    userId: 1,
    expiresIn: moment()
      .add(expirationTime, 'second')
      .valueOf()
  });

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
    it('should buy album 1', done => {
      chai
        .request(server)
        .post('/albums/1')
        .send(userTest)
        .then(res => {
          expect(res).to.have.status(201);
          expect(res.body).have.property('userId');
          expect(res.body).have.property('albumId');
          expect(res.body.albumId).to.equal(1);
          done();
        });
    });
  });

  context('When requesting with a valid token', () => {
    it('should buy album 2', done => {
      chai
        .request(server)
        .post('/albums/2')
        .send(userTest)
        .then(res => {
          expect(res).to.have.status(201);
          expect(res.body).have.property('userId');
          expect(res.body).have.property('albumId');
          expect(res.body.albumId).to.equal(2);
          done();
        });
    });
  });

  context('When requesting with a valid token and try to buy same album twice', () => {
    it('should return error message', done => {
      chai
        .request(server)
        .post('/albums/1')
        .send(userTest)
        .then(res => {
          expect(res).to.have.status(201);
          expect(res.body).have.property('userId');
          expect(res.body).have.property('albumId');
          expect(res.body.albumId).to.equal(1);
          chai
            .request(server)
            .post('/albums/1')
            .send(userTest)
            .then(response => {
              expect(response.body.message).to.equal(
                'Error processing the purchase - Error: Album 1 was already purchased by user 1'
              );
              expect(response).to.have.status(500);
              done();
            });
        });
    });
  });

  context('When requesting with a invalid token', () => {
    it('should return invalid token message', done => {
      userTest.sessionToken = 'invalid token';
      chai
        .request(server)
        .post('/albums/1')
        .send(userTest)
        .then(res => {
          expect(res).to.have.status(500);
          expect(res.body.message).to.equal('Invalid token!');
          done();
        });
    });
  });
});

describe('Controller: Album GET, `src/controller/album`', () => {
  let userTest = {};
  let userBuy = {};
  const token = jwt.createToken({
    userId: 1,
    expiresIn: moment()
      .add(expirationTime, 'second')
      .valueOf()
  });
  const tokenBuy = jwt.createToken({
    userId: 2,
    expiresIn: moment()
      .add(expirationTime, 'second')
      .valueOf()
  });

  factory.define('purchase', Purchase, {
    albumId: 1,
    userId: 2
  });

  beforeEach(done => {
    mocks.mockAlbums();
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

  context('When requesting albums with admin', () => {
    it('should list albums user 2', done => {
      chai
        .request(server)
        .get('/users/2/albums')
        .send(userTest)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body.length).to.equal(2);
          expect(res.body[0]).have.property('albumId');
          expect(res.body[1]).have.property('albumId');
          done();
        });
    });
  });

  context('When requesting albums with not admin', () => {
    it('should return error message', done => {
      userTest.admin = false;
      chai
        .request(server)
        .get('/users/2/albums')
        .send(userTest)
        .then(res => {
          expect(res).to.have.status(500);
          expect(res.body.message).to.equal('User 1 does not have access to another user purchases.');
          done();
        });
    });
  });

  context('When requesting owns albums', () => {
    it('should return owns albums', done => {
      chai
        .request(server)
        .get('/users/2/albums')
        .send(userBuy)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body.length).to.equal(2);
          expect(res.body[0]).have.property('albumId');
          expect(res.body[1]).have.property('albumId');
          done();
        });
    });
  });
});
