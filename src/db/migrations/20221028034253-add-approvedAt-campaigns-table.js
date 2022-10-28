'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('campaigns', 'approvedAt', {
      type: Sequelize.DATE,
    });
  },
  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('campaigns', 'approvedAt');
  },
};
