'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Discount extends Model {
    static associate(models) {
      this.belongsTo(models.Campaign, { foreignKey: 'idCampaign', as: 'campaign' });
      this.belongsTo(models.Product, { foreignKey: 'idProduct', as: 'product' });
    }
  }
  Discount.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      type: {
        type: DataTypes.ENUM('MARKETING', 'SALES'),
        allowNull: false,
      },
      discount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      endDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: 'discounts',
    }
  );
  return Discount;
};
