'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Quotation extends Model {
    static associate(models) {
      this.belongsTo(models.Deal, { foreignKey: 'idDeal', as: 'deal' });
      this.belongsTo(models.QuotationStatus, { foreignKey: 'idStatus', as: 'status' });
      this.hasOne(models.Rejection, { foreignKey: 'idQuotation', as: 'rejection' });
      this.hasMany(models.QuotationDetail, { foreignKey: 'idQuotation', as: 'detail' });
    }
  }
  Quotation.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      limitDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      notes: DataTypes.STRING,
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: 'quotations',
    }
  );
  return Quotation;
};
