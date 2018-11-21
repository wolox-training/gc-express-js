'use strict';

module.exports = (sequelize, DataTypes) => {
  const Purchase = sequelize.define('purchase', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    albumId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  });
  Purchase.associate = function(models) {
    Purchase.belongsTo(models.User, { as: 'purchases', foreignKey: 'userId', targetKey: 'id' });
  };
  return Purchase;
};
