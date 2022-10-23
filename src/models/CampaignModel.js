'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Campaign extends Model {
    static associate(models) {
      this.belongsTo(models.Program, { foreignKey: 'idProgram', as: 'program' });
      this.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
      this.belongsTo(models.User, { foreignKey: 'approvedBy', as: 'approver' });
      this.belongsTo(models.CampaignStatus, { foreignKey: 'idStatus', as: 'status' });
      this.hasMany(models.Discount, { foreignKey: 'idCampaign', as: 'discounts' });
      this.belongsToMany(models.User, {
        foreignKey: 'idCampaign',
        as: 'assigned',
        through: 'usersxcampaigns',
      });
      this.belongsToMany(models.Lead, {
        foreignKey: 'idCampaign',
        as: 'leads',
        through: 'leadsxcampaigns',
      });
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
      numConversions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      step: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      html: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      endDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      goal: DataTypes.STRING,
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
