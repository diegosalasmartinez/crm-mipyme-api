'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Campaign extends Model {
    static associate(models) {
      this.belongsTo(models.Program, { foreignKey: 'idProgram', as: 'program' });
      this.belongsTo(models.User, { foreignKey: 'createdBy', as: 'user' });
    }
  }
  Campaign.init(
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
      lists: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      segments: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: false,
      },
      step: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      startDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      endDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      objetive: DataTypes.STRING,
      budget: DataTypes.FLOAT,
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: 'campaigns',
    }
  );
  return Campaign;
};
