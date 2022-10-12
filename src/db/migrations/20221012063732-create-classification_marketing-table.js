'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('classification_marketing', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      key: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      minPoints: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      maxPoints: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
    await queryInterface.addColumn('leads', 'idClassificationMarketing', {
      type: Sequelize.UUID,
      references: {
        model: 'classification_marketing',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      allowNull: false,
    });
  },
  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('leads', 'idClassificationMarketing');
    await queryInterface.dropTable('classification_marketing');
  },
};
