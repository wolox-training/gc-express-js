const faker = require('faker'),
  models = require('../../app/models');

/**
 * Generate an object which container attributes needed
 * to successfully create a user instance.
 *
 * @param  {Object} props Properties to use for the user.
 *
 * @return {Object}       An object to build the user from.
 */
const data = async (props = {}) => {
  const defaultProps = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: `${faker.internet.userName()}@wolox.com`,
    password: faker.random.alphaNumeric(8, 50)
  };
  return Object.assign({}, defaultProps, props);
};
/**
 * Generates a user instance from the properties provided.
 *
 * @param  {Object} props Properties to use for the user.
 *
 * @return {Object}       A user instance
 */
// exports.userFactory = async (props = {}) => models.User.create(await data(props));
exports.default = async (props = {}) => {
  const user = await data(props);
  return user;
};

exports.listOfUsers = async (props = {}) => {
  const users = [];
  users.push(await data(props));
  users.push(await data(props));
  users.push(await data(props));
  return users;
};
