'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('campaignsxkpi', {
      idCampaign: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: 'campaigns',
          key: 'id',
        },
        allowNull: false,
      },
      idMarketingKPI: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: 'marketing_kpi',
          key: 'id',
        },
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('campaignsxkpi');
  },
};
