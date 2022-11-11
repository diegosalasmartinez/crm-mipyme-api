'use strict';

module.exports = {
  // eslint-disable-next-line no-unused-vars
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('leads', 'createdBy', {
      type: Sequelize.UUID,
      allowNull: true,
    });
  },
  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('leads', 'createdBy', {
      type: Sequelize.UUID,
      allowNull: false,
    });
  },
};
