'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('campaigns', 'numRecessions', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
    await queryInterface.addColumn('campaigns', 'waste', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    });
    await queryInterface.changeColumn('campaigns', 'budget', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    });
  },
  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('campaigns', 'numRecessions');
    await queryInterface.removeColumn('campaigns', 'waste');
    await queryInterface.changeColumn('campaigns', 'budget', {
      type: Sequelize.FLOAT,
    });
  },
};
