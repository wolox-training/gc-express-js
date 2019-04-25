const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists,
  checkUniqueIndex
} = require('sequelize-test-helpers');
const UserModel = require('../../../app/models/user');

describe('Model: Users, `src/models/user`', () => {
  const Model = UserModel(sequelize, dataTypes);
  const instance = new Model();
  checkModelName(Model)('User');
  describe('properties', () => {
    ['id', 'firstName', 'lastName', 'email', 'password', 'createdAt', 'updatedAt'].forEach(
      checkPropertyExists(instance)
    );
  });
  describe('indexes', () => {
    ['id', 'email'].forEach(checkUniqueIndex(instance));
  });
});
