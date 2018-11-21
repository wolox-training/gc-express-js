'use strict';

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      firstName: {
        required: true,
        allowNull: false,
        type: DataTypes.STRING
      },
      lastName: {
        required: true,
        allowNull: false,
        type: DataTypes.STRING
      },
      email: {
        required: true,
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        lowercase: true
      },
      password: {
        required: true,
        allowNull: false,
        type: DataTypes.STRING
      },
      admin: {
        required: true,
        type: DataTypes.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {
      indexes: [{ unique: true, fields: ['id'] }, { unique: true, fields: ['email'] }]
    }
  );
  User.beforeCreate((user, options) => {
    return bcrypt
      .hash(user.password, 10)
      .then(hash => {
        user.password = hash;
      })
      .catch(err => {
        throw new Error();
      });
  });
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  User.associate = function(models) {
    User.hasMany(models.purchase, { as: 'purchases', foreignKey: 'userId', sourceKey: 'id' });
  };
  return User;
};
