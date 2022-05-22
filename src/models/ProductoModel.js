"use strict"
const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class Producto extends Model {
    static associate(models) {
    }
  }
  Producto.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },
      nombre: DataTypes.STRING,
      codigo: DataTypes.STRING,
      descripcion: DataTypes.STRING,
      precioUnidad: DataTypes.FLOAT,
      activo: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      timestamps: true,
      tableName: "Producto"
    }
  )
  return Producto
}
