'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('campaigns', 'clientsGenerated', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
  },
  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('campaigns', 'clientsGenerated');
  },
};
