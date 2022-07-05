"use strict"
const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class EmpresaUsuario extends Model {
    static associate(models) {
      this.belongsTo(models.Usuario, { foreignKey: 'usuarioId' })
      this.belongsTo(models.Empresa, { foreignKey: 'empresaId' })
    }
  }
  EmpresaUsuario.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: "EmpresaUsuario"
    }
  )
  return EmpresaUsuario
}
