'use strict';

module.exports = {
  // eslint-disable-next-line no-unused-vars
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('campaigns', 'htmlTemplate', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },
  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('campaigns', 'htmlTemplate', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },
};
