'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ClassificationSales extends Model {
    static associate(models) {
      this.hasMany(
        models.Contact,
        { foreignKey: 'idClassificationSales', as: 'contacts' },
        {
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        }
      );
    }
  }
  ClassificationSales.init(
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
      tableName: 'classification_sales',
    }
  );
  return ClassificationSales;
};
