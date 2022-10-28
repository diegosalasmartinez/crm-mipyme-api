'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Rejection extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
      this.belongsTo(models.Campaign, { foreignKey: 'idCampaign', as: 'campaign' });
      this.belongsTo(models.Ticket, { foreignKey: 'idTicket', as: 'ticket' });
      this.belongsTo(models.Quotation, { foreignKey: 'idQuotation', as: 'quotation' });
    }
  }
  Rejection.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: 'rejections',
    }
  );
  return Rejection;
};
