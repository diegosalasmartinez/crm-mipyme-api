'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Lead extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
      this.belongsTo(models.ClassificationMarketing, {
        foreignKey: 'idClassificationMarketing',
        as: 'marketingClassification',
      });
      this.belongsToMany(models.List, {
        foreignKey: 'idLead',
        as: 'lists',
        through: 'listsxleads',
      });
      this.belongsToMany(models.Campaign, {
        foreignKey: 'idLead',
        as: 'campaigns',
        through: 'leadsxcampaigns',
      });
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      points: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      birthday: DataTypes.DATE,
      phone: DataTypes.STRING,
      sex: DataTypes.STRING,
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
