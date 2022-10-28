'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ClassificationMarketing extends Model {
    static associate(models) {
      this.hasMany(models.Lead, { foreignKey: 'idClassificationMarketing', as: 'leads' });
    }
  }
  ClassificationMarketing.init(
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
      minPoints: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      maxPoints: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: false,
      tableName: 'classification_marketing',
    }
  );
  return ClassificationMarketing;
};
