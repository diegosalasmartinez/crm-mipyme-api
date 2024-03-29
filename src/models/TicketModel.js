'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    static associate(models) {
      this.belongsTo(models.TicketType, { foreignKey: 'idType', as: 'type' });
      this.belongsTo(models.TicketPriority, { foreignKey: 'idPriority', as: 'priority' });
      this.belongsTo(models.TicketStatus, { foreignKey: 'idStatus', as: 'status' });
      this.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
      this.belongsTo(models.User, { foreignKey: 'assignedTo', as: 'assigned' });
      this.belongsTo(models.Contact, { foreignKey: 'idContact', as: 'contact' });
      this.hasOne(models.Deal, { foreignKey: 'idTicket', as: 'deal' });
      this.hasMany(models.Activity, { foreignKey: 'idTicket', as: 'activities' });
      this.hasMany(models.Note, { foreignKey: 'idTicket', as: 'notes' });
    }
  }
  Ticket.init(
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
      limitDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      description: DataTypes.STRING,
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: 'tickets',
    }
  );
  return Ticket;
};
