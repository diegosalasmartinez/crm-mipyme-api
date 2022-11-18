'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('companies', 'quotationRules', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('companies', 'quotationsRules');
  },
};
