'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Discount extends Model {
    static associate(models) {
      this.belongsTo(models.DiscountType, { foreignKey: 'idType', as: 'type' });
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
      status: {
        type: DataTypes.ENUM('0', '1', '2'),
        defaultValue: '0',
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
