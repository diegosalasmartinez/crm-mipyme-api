'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('campaigns', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      idProgram: {
        type: Sequelize.UUID,
        references: {
          model: 'programs',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      lists: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },
      segments: {
        type: Sequelize.ARRAY(Sequelize.JSONB),
        allowNull: false,
      },
      step: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      startDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      endDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      objetive: Sequelize.STRING,
      budget: Sequelize.FLOAT,
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('campaigns');
  },
};
