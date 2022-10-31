'use strict';

module.exports = {
  // eslint-disable-next-line no-unused-vars
  async up(queryInterface, Sequelize) {
    return queryInterface.removeColumn('activities', 'notes');
  },
  async down(queryInterface, Sequelize) {
    return queryInterface.addColumn('activities', 'notes', {
      type: Sequelize.STRING,
    });
  },
};
