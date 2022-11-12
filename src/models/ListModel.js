'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class List extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
      this.belongsToMany(models.Lead, {
        foreignKey: 'idList',
        as: 'leads',
        through: 'listsxleads',
      });
      this.belongsToMany(models.Form, {
        foreignKey: 'idList',
        as: 'forms',
        through: 'listsxforms',
      });
    }
  }
  List.init(
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
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: 'lists',
    }
  );
  return List;
};
