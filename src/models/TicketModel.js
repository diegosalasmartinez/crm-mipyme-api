'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    static associate(models) {
      this.belongsTo(models.TicketType, { foreignKey: 'idType', as: 'type' });
      this.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
      this.belongsTo(models.User, { foreignKey: 'assignedTo', as: 'assigned' });
      this.belongsTo(models.Contact, { foreignKey: 'idContact', as: 'contact' });
      // this.hasMany(
      //   models.Activity,
      //   { foreignKey: 'idDeal', as: 'activities' },
      //   {
      //     onDelete: 'SET NULL',
      //     onUpdate: 'CASCADE',
      //   }
      // );
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
