'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    static associate(models) {
      this.belongsTo(models.ActivityType, { foreignKey: 'idType', as: 'type' });
      this.belongsTo(models.ActivityStatus, { foreignKey: 'idStatus', as: 'status' });
      this.belongsTo(models.Deal, { foreignKey: 'idDeal', as: 'deal' });
      this.belongsTo(models.Ticket, { foreignKey: 'idTicket', as: 'ticket' });
      this.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
    }
  }
  Activity.init(
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
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      notes: DataTypes.STRING,
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: 'activities',
    }
  );
  return Activity;
};
