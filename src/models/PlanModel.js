'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Plan extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'createdBy', as: 'user' });
      this.hasMany(
        models.Program,
        { foreignKey: 'idPlan', as: 'programs' },
        {
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        }
      );
    }
  }
  Plan.init(
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
      objetive: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      budget: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      description: DataTypes.STRING,
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: 'plans',
    }
  );
  return Plan;
};
