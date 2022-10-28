'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TicketType extends Model {
    static associate(models) {
      this.hasMany(models.Ticket, { foreignKey: 'idType', as: 'tickets' });
      this.hasMany(models.Article, { foreignKey: 'idType', as: 'articles' });
    }
  }
  TicketType.init(
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
      tableName: 'ticket_type',
    }
  );
  return TicketType;
};
