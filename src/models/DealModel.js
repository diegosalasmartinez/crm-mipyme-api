'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Deal extends Model {
    static associate(models) {
      this.belongsTo(models.DealOrigin, { foreignKey: 'idOrigin', as: 'origin' });
      this.belongsTo(models.DealStep, { foreignKey: 'idStep', as: 'step' });
      this.belongsTo(models.Campaign, { foreignKey: 'idCampaign', as: 'campaign' });
      this.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
      this.belongsTo(models.Contact, { foreignKey: 'idContact', as: 'contact' });
    }
  }
  Deal.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      probability: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      expectedAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      expectedCloseDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      realAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      realCloseDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: 'deals',
    }
  );
  return Deal;
};
