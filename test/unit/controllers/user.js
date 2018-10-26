// Require the dev-dependencies
const _ = require('lodash');
const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const User = require('../../../app/models').User;
const server = require('../../../app');
const userFactory = require('../../factories/user');

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
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Created user.');
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
    _.set(userTest, 'password', '');
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
