"use strict"
const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class Empresa extends Model {
    static associate(models) {
      this.hasOne(models.EmpresaUsuario, { foreignKey: 'empresaId', as: 'empresaUsuario' }, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      })
      this.hasMany(models.Producto, { foreignKey: 'empresaId', as: 'productos' }, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      })
    }
  }
  Empresa.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },
      nombre: DataTypes.STRING,
      direccion: DataTypes.STRING,
      telefono: DataTypes.STRING,
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: "Empresa"
    }
  )
  return Empresa
}
