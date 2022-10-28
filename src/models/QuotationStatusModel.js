'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class QuotationStatus extends Model {
    static associate(models) {
      this.hasMany(models.Quotation, { foreignKey: 'idStatus', as: 'quotations' });
    }
  }
  QuotationStatus.init(
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
      tableName: 'quotation_status',
    }
  );
  return QuotationStatus;
};
