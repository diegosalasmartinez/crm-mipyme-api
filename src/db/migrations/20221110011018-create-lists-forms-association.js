'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('listsxforms', {
      idList: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: 'lists',
          key: 'id',
        },
        allowNull: false,
      },
      idForm: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: 'forms',
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
    await queryInterface.dropTable('listsxforms');
  },
};
