'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Form extends Model {
    static associate(models) {
      this.belongsTo(models.Company, { foreignKey: 'idCompany', as: 'company' });
      this.belongsToMany(models.List, {
        foreignKey: 'idForm',
        as: 'lists',
        through: 'listsxforms',
      });
    }
  }
  Form.init(
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
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subtitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      textButton: {
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
      tableName: 'forms',
    }
  );
  return Form;
};
