// Require the dev-dependencies
const _ = require('lodash'),
  chai = require('chai'),
  expect = require('chai').expect,
  chaiHttp = require('chai-http'),
  User = require('../../../app/models').User,
  server = require('../../../app'),
  userFactory = require('../../factories/user'),
  jwt = require('../../../app/tools/jwtToken'),
  moment = require('moment'),
  faker = require('faker'),
  factory = require('factory-girl').factory;

const should = chai.should();
chai.use(chaiHttp);

describe('Controller: Users POST, `src/controller/user`', () => {
  let userTest = {};
  beforeEach(() => {
    userTest = userFactory.default();
  });
  it('POST: it should create user.', done => {
    chai
      .request(server)
      .post('/users')
      .send(userTest)
      .then(res => {
        expect(res).to.have.status(201);
        expect(res.body.message).to.equal('Created user.');

        User.findById(res.body.user.id).then(response => {
          expect(response.body.user.firstName).to.equal(userTest.firstName);
          expect(response.body.user.lastName).to.equal(userTest.lastName);
          expect(response.body.user.email).to.equal(userTest.email);
        });
        done();
      });
  });

  it('POST: it should don`t create user. Domain of email isn`t "wolox".', done => {
    _.set(userTest, 'email', 'emailTest@isnt_wolox.com');
    chai
      .request(server)
      .post('/users')
      .send(userTest)
      .then(res => {
        expect(res.body.message).to.equal('Invalid email!');
        done();
      });
  });

  it('POST: it should don`t create user. Password isn`t length requied.', done => {
    _.set(userTest, 'password', '123');
    chai
      .request(server)
      .post('/users')
      .send(userTest)
      .then(res => {
        expect(res.body.message).to.equal('Invalid password!');
        done();
      });
  });
  it('POST: it should don`t create user. Password require alphanumeric value.', done => {
    _.set(userTest, 'password', 'àsd/qwe"@wolox.com');
    chai
      .request(server)
      .post('/users')
      .send(userTest)
      .then(res => {
        expect(res.body.message).to.equal('Invalid password!');
        done();
      });
  });
  it('POST: it should don`t create user. Attribute email isn`t valid.', done => {
    _.set(userTest, 'email', 'emailTest wolox.com');
    chai
      .request(server)
      .post('/users')
      .send(userTest)
      .then(res => {
        expect(res.body.message).to.equal('Invalid email!');
        done();
      });
  });
  it('POST: it should don`t create user. FirstName, lastName, email and password are attributes don`t passed on request.', done => {
    _.unset(userTest, 'firstName');
    _.unset(userTest, 'lastName');
    _.unset(userTest, 'email');
    _.unset(userTest, 'password');
    chai
      .request(server)
      .post('/users')
      .send(userTest)
      .then(res => {
        expect(res.body.message).to.equal('Missing parameters: email,password,firstName,lastName');
        done();
      });
  });
});

describe.only('Controller: Users/sessions POST', () => {
  let userTest = {};

  factory.define('user', User, {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: `${faker.internet.userName()}@wolox.com`,
    password: faker.random.alphaNumeric(8, 50)
  });

  beforeEach(done => {
    factory.create('user').then(user => {
      user.reload();
      userTest = user.dataValues;
      done();
    });
  });

  context('When requesting with a valid token', () => {
    it('should return the user', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send(userTest)
        .then(res => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  context('When requesting with an invalid email', () => {
    it('should return error message', done => {
      _.set(userTest, 'email', 'emailTest@isnt_wolox.com');
      chai
        .request(server)
        .post('/users/sessions')
        .send(userTest)
        .then(res => {
          expect(res.body.message).to.equal('Invalid email!');
          done();
        });
    });
  });

  context('When requesting with an invalid password', () => {
    it('should return error message', done => {
      _.set(userTest, 'password', 'asdad2*qawe21q');
      chai
        .request(server)
        .post('/users/sessions')
        .send(userTest)
        .then(res => {
          expect(res.body.message).to.equal('Invalid user');
          done();
        });
    });
  });
});
