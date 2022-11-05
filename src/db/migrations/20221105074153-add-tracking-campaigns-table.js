'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('campaigns', 'visitsQty', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
    await queryInterface.addColumn('campaigns', 'visitsLeads', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: [],
    });
  },
  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('campaigns', 'visitsQty');
    await queryInterface.removeColumn('campaigns', 'visitsLeads');
  },
};
