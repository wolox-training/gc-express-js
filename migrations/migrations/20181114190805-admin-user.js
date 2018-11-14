'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Users', 'admin', {
      type: Sequelize.BOOLEAN,
      allowNull: true
    });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Users', 'admin');
  }
};
