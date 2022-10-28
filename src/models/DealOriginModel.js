'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DealOrigin extends Model {
    static associate(models) {
      this.hasMany(models.Deal, { foreignKey: 'idOrigin', as: 'deals' });
    }
  }
  DealOrigin.init(
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
      tableName: 'deal_origin',
    }
  );
  return DealOrigin;
};
