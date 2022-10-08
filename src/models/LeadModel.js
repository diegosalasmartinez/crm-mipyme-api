'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Lead extends Model {
    static associate(models) {
      this.belongsTo(models.Company, { foreignKey: 'companyId' });
      this.belongsTo(models.User, { foreignKey: 'createdBy' });
      this.belongsTo(models.List, { foreignKey: 'listId' });
    }
  }
  Lead.init(
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
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      birthday: DataTypes.DATE,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: DataTypes.STRING,
      sex: DataTypes.STRING,
      points: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      position: DataTypes.STRING,
      companyName: DataTypes.STRING,
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      maritalStatus: DataTypes.STRING,
      notes: DataTypes.STRING,
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: 'leads',
    }
  );
  return Lead;
};
