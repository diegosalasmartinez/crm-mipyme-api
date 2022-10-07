'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('leads', 'listId', {
          type: Sequelize.UUID,
          references: {
            model: 'lists',
            key: 'id',
          },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
          allowNull: true,
        }, { transaction: t }),
        queryInterface.addColumn('leads', 'createdBy', {
          type: Sequelize.UUID,
          references: {
            model: 'users',
            key: 'id',
          },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
          allowNull: false,
        }, { transaction: t }),
      ])
    })
  },
  // eslint-disable-next-line no-unused-vars
  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('leads', 'listId', { transaction: t }),
        queryInterface.removeColumn('leads', 'createdBy', { transaction: t }),
      ])
    })
  }
};
