'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    static associate(models) {
      this.belongsTo(models.Lead, { foreignKey: 'idLead', as: 'lead' });
      this.belongsTo(models.User, { foreignKey: 'assignedTo', as: 'assigned' });
      this.belongsTo(
        models.ClassificationSales,
        { foreignKey: 'idClassificationSales', as: 'classificationSales' },
        {
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        }
      );
    }
  }
  Contact.init(
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
      tableName: 'contacts',
    }
  );
  return Contact;
};
