'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
      this.belongsTo(models.Deal, { foreignKey: 'idDeal', as: 'deal' });
      this.belongsTo(models.Ticket, { foreignKey: 'idTicket', as: 'ticket' });
      this.belongsTo(models.Activity, { foreignKey: 'idActivity', as: 'activity' });
    }
  }
  Note.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      body: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: 'notes',
    }
  );
  return Note;
};
