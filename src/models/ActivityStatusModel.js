'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataStatuss) => {
  class ActivityStatus extends Model {
    static associate(models) {
      this.hasMany(models.Activity, { foreignKey: 'idStatus', as: 'activities' });
    }
  }
  ActivityStatus.init(
    {
      id: {
        type: DataStatuss.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataStatuss.UUIDV4,
      },
      key: {
        type: DataStatuss.STRING,
        allowNull: false,
      },
      name: {
        type: DataStatuss.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: false,
      tableName: 'activity_status',
    }
  );
  return ActivityStatus;
};
