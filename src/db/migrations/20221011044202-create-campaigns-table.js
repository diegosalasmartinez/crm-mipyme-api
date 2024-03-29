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
      createdBy: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      approvedBy: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        allowNull: true,
      },
      idStatus: {
        type: Sequelize.UUID,
        references: {
          model: 'campaign_status',
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
      startDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      endDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      numConversions: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      step: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      html: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      htmlTemplate: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      sent: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      goal: Sequelize.STRING,
      budget: Sequelize.FLOAT,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('campaigns');
  },
};
