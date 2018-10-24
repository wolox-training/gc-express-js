// Require the dev-dependencies
const _ = require('lodash');
const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const User = require('../../../app/models');
const server = require('../../../app');
const userFactory = require('../../factories/user');

const should = chai.should();

describe('Controller: Users POST, `src/controller/user`', async () => {
  let userTest = {};
  beforeEach(async () => {
    userTest = await userFactory.default();
  });
  it('POST: it should create user. (happy path)', async () => {
    const response = await chai
      .request(server)
      .post('/users')
      .send(userTest);
    expect(response).to.have.status(200);
    expect(response.body.message).to.equal('Created user.');
  });
  it('POST: it should don`t create user. Domain of email isn`t "wolox".', async () => {
    _.set(userTest, 'email', 'emailTest@isnt_wolox.com');
    await chai
      .request(server)
      .post('/users')
      .send(userTest)
      .catch(error => {
        expect(error.response).to.have.status(422);
        expect(error.response.body.message).to.include.members(['Domain of email is not valid.']);
      });
  });
  it('POST: it should don`t create user. Password isn`t length requied.', async () => {
    _.set(userTest, 'password', '');
    await chai
      .request(server)
      .post('/users')
      .send(userTest)
      .catch(error => {
        expect(error.response).to.have.status(422);
        expect(error.response.body.message).to.include.members(['Password length is not in this range.']);
      });
  });
  it('POST: it should don`t create user. Password require alphanumeric value.', async () => {
    _.set(userTest, 'password', 'àsd/qwe"@wolox.com');
    await chai
      .request(server)
      .post('/users')
      .send(userTest)
      .catch(error => {
        expect(error.response).to.have.status(422);
        expect(error.response.body.message).to.include.members(['Password require alphanumeric value.']);
      });
  });
  it('POST: it should don`t create user. Email isn`t unique.', async () => {
    await chai
      .request(server)
      .post('/users')
      .send(userTest);
    await chai
      .request(server)
      .post('/users')
      .send(userTest)
      .catch(error => {
        expect(error.response).to.have.status(422);
        expect(error.response.body.message).to.include.members(['email must be unique']);
      });
  });
  it('POST: it should don`t create user. Attribute email isn`t valid.', async () => {
    _.set(userTest, 'email', 'emailTest wolox.com');
    await chai
      .request(server)
      .post('/users')
      .send(userTest)
      .catch(error => {
        expect(error.response).to.have.status(422);
        expect(error.response.body.message).to.include.members(['Validation isEmail on email failed']);
      });
  });
  it('POST: it should don`t create user. FirstName, lastName, email and password are attributes don`t passed on request.', async () => {
    _.unset(userTest, 'firstName');
    _.unset(userTest, 'lastName');
    _.unset(userTest, 'email');
    _.unset(userTest, 'password');
    await chai
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
