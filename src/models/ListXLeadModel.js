'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ListXLead extends Model {
    static associate(models) {
      this.belongsTo(models.List, { foreignKey: 'idList', as: 'list' });
      this.belongsTo(models.Lead, { foreignKey: 'idLead', as: 'lead' });
    }
  }
  ListXLead.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: 'listsxleads',
    }
  );
  return ListXLead;
};
