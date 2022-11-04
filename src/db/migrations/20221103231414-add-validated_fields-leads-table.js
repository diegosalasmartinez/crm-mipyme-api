'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('leads', 'emailValidated', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn('leads', 'phoneValidated', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },
  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('leads', 'emailValidated');
    await queryInterface.removeColumn('leads', 'phoneValidated');
  },
};
