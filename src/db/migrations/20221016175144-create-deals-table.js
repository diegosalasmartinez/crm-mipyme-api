'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('deals', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      idCampaign: {
        type: Sequelize.UUID,
        references: {
          model: 'campaigns',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        allowNull: true,
      },
      idContact: {
        type: Sequelize.UUID,
        references: {
          model: 'contacts',
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
      idOrigin: {
        type: Sequelize.UUID,
        references: {
          model: 'deal_origin',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      idStep: {
        type: Sequelize.UUID,
        references: {
          model: 'deal_step',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      probability: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      expectedAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      expectedCloseDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      realAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      realCloseDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
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
    await queryInterface.dropTable('deals');
  }
};
