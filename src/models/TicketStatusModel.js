'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataStatuss) => {
  class TicketStatus extends Model {
    static associate(models) {
      this.hasMany(
        models.Ticket,
        { foreignKey: 'idStatus', as: 'tickets' },
        {
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        }
      );
    }
  }
  TicketStatus.init(
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
      tableName: 'ticket_status',
    }
  );
  return TicketStatus;
};
