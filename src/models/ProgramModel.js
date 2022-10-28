'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Program extends Model {
    static associate(models) {
      this.belongsTo(models.Plan, { foreignKey: 'idPlan', as: 'plan' });
      this.hasMany(models.Campaign, { foreignKey: 'idProgram', as: 'campaigns' });
    }
  }
  Program.init(
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
      description: DataTypes.STRING,
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: 'programs',
    }
  );
  return Program;
};
