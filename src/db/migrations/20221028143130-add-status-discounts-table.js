'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('discounts', 'status', {
      type: Sequelize.ENUM('0', '1', '2'),
      defaultValue: '0',
    });
  },
  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('discounts', 'status');
  },
};
