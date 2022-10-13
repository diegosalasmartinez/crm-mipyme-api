'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('listsxleads', {
      idList: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: 'lists',
          key: 'id',
        },
        allowNull: false,
      },
      idLead: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: 'leads',
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
    return queryInterface.dropTable('listsxleads');
  },
};
