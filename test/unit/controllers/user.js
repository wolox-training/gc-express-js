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
  it('POST: it should create user.', () => {
    chai
      .request(server)
      .post('/users')
      .send(userTest)
      .then(res => {
        expect(res).to.have.status(201);
        expect(res.body.message).to.equal('Created user.');

        expect(res.body.user).to.have.property('id');
        expect(res.body.user.firstName).to.equal(userTest.firstName);
        expect(res.body.user.lastName).to.equal(userTest.lastName);
        expect(res.body.user.email).to.equal(userTest.email);
      });
  });

  it('POST: it should don`t create user. Domain of email isn`t "wolox".', () => {
    _.set(userTest, 'email', 'emailTest@isnt_wolox.com');
    chai
      .request(server)
      .post('/users')
      .send(userTest)
      .catch(error => {
        expect(error.response).to.have.status(422);
        expect(error.response.body.message).to.include.members(['Domain of email is not valid.']);
      });
  });
  it('POST: it should don`t create user. Password isn`t length requied.', () => {
    _.set(userTest, 'password', '123');
    chai
      .request(server)
      .post('/users')
      .send(userTest)
      .catch(error => {
        expect(error.response).to.have.status(422);
        expect(error.response.body.message).to.include.members(['Password length is not in this range.']);
      });
  });
  it('POST: it should don`t create user. Password require alphanumeric value.', () => {
    _.set(userTest, 'password', 'àsd/qwe"@wolox.com');
    chai
      .request(server)
      .post('/users')
      .send(userTest)
      .catch(error => {
        expect(error.response).to.have.status(422);
        expect(error.response.body.message).to.include.members(['Password require alphanumeric value.']);
      });
  });
  it('POST: it should don`t create user. Email isn`t unique.', () => {
    chai
      .request(server)
      .post('/users')
      .send(userTest);
    chai
      .request(server)
      .post('/users')
      .send(userTest)
      .catch(error => {
        expect(error.response).to.have.status(422);
        expect(error.response.body.message).to.include.members(['email must be unique']);
      });
  });
  it('POST: it should don`t create user. Attribute email isn`t valid.', () => {
    _.set(userTest, 'email', 'emailTest wolox.com');
    chai
      .request(server)
      .post('/users')
      .send(userTest)
      .catch(error => {
        expect(error.response).to.have.status(422);
        expect(error.response.body.message).to.include.members(['Validation isEmail on email failed']);
      });
  });
  it('POST: it should don`t create user. FirstName, lastName, email and password are attributes don`t passed on request.', () => {
    _.unset(userTest, 'firstName');
    _.unset(userTest, 'lastName');
    _.unset(userTest, 'email');
    _.unset(userTest, 'password');
    chai
      .request(server)
      .post('/users')
      .send(userTest)
      .catch(error => {
        expect(error.response).to.have.status(422);
        expect(error.response.body.message).to.include.members([
          'User.firstName cannot be null',
          'User.lastName cannot be null',
          'User.email cannot be null',
          'User.password cannot be null'
        ]);
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

  context('When requesting with a valid token', done => {
    it('should return the user', () => {
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

  context('When requesting with an invalid email', done => {
    it('should return 422', () => {
      _.set(userTest, 'email', 'emailTest@isnt_wolox.com');
      chai
        .request(server)
        .post('/users/sessions')
        .send(userTest)
        .catch(res => {
          expect(res).to.have.status(422);
          done();
        });
    });
  });

  context('When requesting with an invalid password', done => {
    it('should return 422', () => {
      _.set(userTest, 'password', 'asdad2*qawe21q');
      chai
        .request(server)
        .post('/users/sessions')
        .send(userTest)
        .catch(res => {
          expect(res).to.have.status(422);
          done();
        });
    });
  });
});
