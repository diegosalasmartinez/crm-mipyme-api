'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LostType extends Model {
    static associate(models) {
      this.hasMany(
        models.Deal,
        { foreignKey: 'idLostType', as: 'deals' },
        {
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        }
      );
    }
  }
  LostType.init(
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
      tableName: 'lost_type',
    }
  );
  return LostType;
};
