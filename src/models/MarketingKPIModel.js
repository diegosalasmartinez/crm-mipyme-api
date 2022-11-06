'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MarketingKPI extends Model {
    static associate(models) {
      this.belongsToMany(models.Campaign, {
        foreignKey: 'idMarketingKPI',
        as: 'campaigns',
        through: 'campaignsxkpi',
      });
    }
  }
  MarketingKPI.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: false,
      tableName: 'marketing_kpi',
    }
  );
  return MarketingKPI;
};
