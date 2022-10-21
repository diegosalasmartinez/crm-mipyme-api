'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('quotation_details', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      idQuotation: {
        type: Sequelize.UUID,
        references: {
          model: 'quotations',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      idProduct: {
        type: Sequelize.UUID,
        references: {
          model: 'products',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      quantity: Sequelize.INTEGER,
      unitPrice: Sequelize.FLOAT,
      totalPrice: Sequelize.FLOAT,
      discount: Sequelize.FLOAT,
      finalPrice: Sequelize.FLOAT,
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
    await queryInterface.dropTable('quotation_details');
  }
};
