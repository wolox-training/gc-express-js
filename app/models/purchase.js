'use strict';

module.exports = (sequelize, DataTypes) => {
  const Purchase = sequelize.define(
    'purchase',
    {
      albumId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, field: 'album_id' }
    },
    {
      underscored: true
    }
  );
  Purchase.associate = function(models) {
    Purchase.belongsTo(models.user);
  };
  return Purchase;
};
