'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('activities', 'realStartDate', {
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn('activities', 'realEndDate', {
      type: Sequelize.DATE,
    });
  },
  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('activities', 'realStartDate');
    await queryInterface.removeColumn('activities', 'realEndDate');
  },
};
