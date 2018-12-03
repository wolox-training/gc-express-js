'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Users', 'isActive', {
      type: Sequelize.BOOLEAN,
      allowNull: true
    });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Users', 'isActive');
  }
};
