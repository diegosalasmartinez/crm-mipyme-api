'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    static associate(models) {
      this.hasMany(
        models.User,
        { foreignKey: 'idCompany', as: 'users' },
        {
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        }
      );
    }
  }
  Company.init(
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: DataTypes.STRING,
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: 'companies',
    }
  );
  return Company;
};
