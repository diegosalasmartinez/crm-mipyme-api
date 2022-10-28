'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TicketPriority extends Model {
    static associate(models) {
      this.hasMany(models.Ticket, { foreignKey: 'idPriority', as: 'tickets' });
    }
  }
  TicketPriority.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: false,
      tableName: 'ticket_priority',
    }
  );
  return TicketPriority;
};
