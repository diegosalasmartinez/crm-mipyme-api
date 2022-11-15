'use strict';

module.exports = {
  // eslint-disable-next-line no-unused-vars
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('quotations', 'startDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn('quotations', 'limitDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },
  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('quotations', 'startDate', {
      type: Sequelize.DATE,
      allowNull: false,
    });
    await queryInterface.changeColumn('quotations', 'limitDate', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },
};
