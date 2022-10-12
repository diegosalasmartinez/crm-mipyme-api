'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('listsxleads', {
      idList: {
        type: Sequelize.UUID,
        references: {
          model: 'lists',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      idLead: {
        type: Sequelize.UUID,
        references: {
          model: 'leads',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
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
  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('listsxleads');
  },
};
