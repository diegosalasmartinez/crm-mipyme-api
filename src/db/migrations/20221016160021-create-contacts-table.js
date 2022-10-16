'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('contacts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
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
      idClassificationSales: {
        type: Sequelize.UUID,
        references: {
          model: 'classification_sales',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        allowNull: false,
      }, 
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('contacts');
  }
};
