'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('leads', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      companyId: {
        type: Sequelize.UUID,
        references: {
          model: 'companies',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      birthday: Sequelize.DATE,
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: Sequelize.STRING,
      sex: Sequelize.STRING,
      points: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      position: Sequelize.STRING,
      companyName: Sequelize.STRING,
      address: Sequelize.STRING,
      city: Sequelize.STRING,
      maritalStatus: Sequelize.STRING,
      notes: Sequelize.STRING,
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })
  },
  // eslint-disable-next-line no-unused-vars
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('leads');
  }
};
