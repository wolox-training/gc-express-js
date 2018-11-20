// Require the dev-dependencies
const _ = require('lodash'),
  chai = require('chai'),
  expect = require('chai').expect,
  chaiHttp = require('chai-http'),
  User = require('../../../app/models').User,
  server = require('../../../app'),
  userFactory = require('../../factories/user'),
  faker = require('faker'),
  factory = require('factory-girl').factory,
  jwt = require('../../../app/tools/jwtToken');

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
        chai
          .request(server)
          .post(`/getUser/${res.body.user.id}`)
          .then(response => {
            expect(response.body.user.firstName).to.equal(userTest.firstName);
            expect(response.body.user.lastName).to.equal(userTest.lastName);
            expect(response.body.user.email).to.equal(userTest.email);
            done();
          });
      });
  });

  it('POST: it should don`t create user. Domain of email isn`t "wolox".', done => {
    _.set(userTest, 'email', 'emailTest@isnt_wolox.com');
    chai
      .request(server)
      .post('/users')
      .send(userTest)
      .then(res => {
        expect(res).to.have.status(500);
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
        expect(res).to.have.status(500);
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
        expect(res).to.have.status(500);
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
        expect(res).to.have.status(500);
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
        expect(res).to.have.status(500);
        expect(res.body.message).to.equal('Missing parameters: email,password,firstName,lastName');
        done();
      });
  });
});

describe('Controller: Users/sessions POST', () => {
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
          expect(res.body).have.property('sessionToken');
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
          expect(res).to.have.status(500);
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
          expect(res).to.have.status(500);
          expect(res.body.message).to.equal('Invalid user');
          done();
        });
    });
  });
});

describe('Controller: Users GET, `src/controller/user`', () => {
  let userTest = {};
  const request = (limit, page) => `/users?limit=${limit}&page=${page}`;

  beforeEach(done => {
    factory.create('user').then(user => {
      user.reload();
      userTest = user.dataValues;
      factory
        .createMany('user', 5, [
          { email: `${faker.internet.userName()}@wolox.com` },
          { email: `${faker.internet.userName()}@wolox.com` },
          { email: `${faker.internet.userName()}@wolox.com` },
          { email: `${faker.internet.userName()}@wolox.com` },
          { email: `${faker.internet.userName()}@wolox.com` }
        ])
        .then(() => {
          done();
        });
    });
  });

  context('When requesting with valid token and parameters', () => {
    it('should return users list', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send(userTest)
        .then(res => {
          chai
            .request(server)
            .get(request(2, 1))
            .set('sessionToken', res.body.sessionToken)
            .send(res.body)
            .then(response => {
              expect(res).to.have.status(200);
              expect(response.body.result.length).to.equal(2);
              expect(response.body).have.property('count');
              expect(response.body).have.property('pages');
              done();
            });
        });
    });
  });

  context('When requesting with invalid token', () => {
    it('shoul return invalid token message', done => {
      chai
        .request(server)
        .get(request(2, 1))
        .send(userTest)
        .then(res => {
          expect(res).to.have.status(500);
          expect(res.body.message).to.equal('Invalid token!');
          done();
        });
    });
  });

  context('When requesting with no parameters', () => {
    it('should return the first page of 3 users, using default values', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send(userTest)
        .then(res => {
          chai
            .request(server)
            .get(request('', ''))
            .set('sessionToken', res.body.sessionToken)
            .send(res.body)
            .then(response => {
              expect(res).to.have.status(200);
              expect(response.body.result.length).to.equal(3);
              expect(response.body).have.property('count');
              expect(response.body).have.property('pages');
              done();
            });
        });
    });
  });

  context('When requesting with invalid parameters', () => {
    it('should return the first page of 3 users, using default values', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send(userTest)
        .then(res => {
          chai
            .request(server)
            .get(request(3, -2))
            .set('sessionToken', res.body.sessionToken)
            .send(res.body)
            .then(response => {
              expect(res).to.have.status(200);
              expect(response.body.result.length).to.equal(3);
              expect(response.body).have.property('count');
              expect(response.body).have.property('pages');
              done();
            });
        });
    });
  });

  context('When requesting with valid parameters', () => {
    it('should return the second page of 2 users', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send(userTest)
        .then(res => {
          chai
            .request(server)
            .get(request(2, 2))
            .set('sessionToken', res.body.sessionToken)
            .send(res.body)
            .then(response => {
              expect(res).to.have.status(200);
              expect(response.body.result.length).to.equal(2);
              expect(response.body).have.property('count');
              expect(response.body).have.property('pages');
              done();
            });
        });
    });
  });
});

describe('Controller: Users POST, `src/controller/user`', () => {
  let userTest = {};
  let userTest2 = {};
  const token = jwt.createToken({ userId: 1 });

  factory.define('userNotAdmin', User, {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: `${faker.internet.userName()}@wolox.com`,
    password: faker.random.alphaNumeric(8, 50),
    admin: false
  });

  beforeEach(done => {
    factory.create('userNotAdmin').then(user => {
      userTest = user.dataValues;
      userTest.sessionToken = token;
      factory.buildMany('user', 1, [{ email: `${faker.internet.userName()}@wolox.com` }]).then(userBuild => {
        userTest2 = userBuild[0].dataValues;
        userTest2.sessionToken = token;
        done();
      });
    });
  });

  context('When requesting with valid token and parameters', () => {
    it('should update no admin user to admin user', done => {
      chai
        .request(server)
        .post('/admin/users')
        .send(userTest)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body.admin).to.equal(true);
          done();
        })
        .catch(err => {
          console.log(err);
        });
    });
  });

  context('When requesting with valid token and parameters', () => {
    it('should return new admin user', done => {
      chai
        .request(server)
        .post('/admin/users')
        .send(userTest2)
        .then(res => {
          expect(res).to.have.status(201);
          expect(res.body.admin).to.equal(true);
          expect(res.body).have.property('firstName');
          expect(res.body).have.property('lastName');
          expect(res.body).have.property('password');
          expect(res.body).have.property('email');
          done();
        });
    });
  });

  context('When requesting with invalid token', () => {
    it('shoul return invalid token message', done => {
      userTest.sessionToken = 'invalid';
      chai
        .request(server)
        .post('/admin/users')
        .send(userTest)
        .then(res => {
          expect(res).to.have.status(500);
          expect(res.body.message).to.equal('Invalid token!');
          done();
        });
    });
  });

  context('When requesting with invalid email', () => {
    it('shoul return invalid email message', done => {
      userTest.email = `${faker.internet.userName()}@not_wolox.com`;
      chai
        .request(server)
        .post('/admin/users')
        .send(userTest)
        .then(res => {
          expect(res).to.have.status(500);
          expect(res.body.message).to.equal('Invalid email!');
          done();
        });
    });
  });
});
