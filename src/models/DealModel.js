'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Deal extends Model {
    static associate(models) {
      this.belongsTo(models.DealOrigin, { foreignKey: 'idOrigin', as: 'origin' });
      this.belongsTo(models.DealStep, { foreignKey: 'idStep', as: 'step' });
      this.belongsTo(models.DealPriority, { foreignKey: 'idPriority', as: 'priority' });
      this.belongsTo(models.LostType, { foreignKey: 'idLostType', as: 'lostType' });
      this.belongsTo(models.Campaign, { foreignKey: 'idCampaign', as: 'campaign' });
      this.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
      this.belongsTo(models.Contact, { foreignKey: 'idContact', as: 'contact' });
      this.hasMany(
        models.Activity,
        { foreignKey: 'idDeal', as: 'activities' },
        {
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        }
      );
      this.hasMany(
        models.Quotation,
        { foreignKey: 'idDeal', as: 'quotations' },
        {
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        }
      );
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
      probability: DataTypes.FLOAT,
      expectedAmount: DataTypes.FLOAT,
      expectedCloseDate: DataTypes.DATE,
      description: DataTypes.STRING,
      realAmount: DataTypes.FLOAT,
      realCloseDate: DataTypes.DATE,
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
