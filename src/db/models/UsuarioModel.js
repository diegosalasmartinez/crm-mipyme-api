"use strict"
const { Model } = require("sequelize")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      this.belongsTo(models.Empresa, { foreignKey: 'empresaId', as: 'empresa' })
    }
    setPassword = async () => {
      const salt = await bcrypt.genSalt(10)
      this.password = await bcrypt.hash(this.password, salt)
    }
    comparePassword = async (password) => {
      return await bcrypt.compare(password, this.password)
    }
    createJWT = () => {
      return jwt.sign( { userId: this.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME } )    
    }
    getFullName = () => {
      return `${this.nombre} ${this.apePaterno} ${this.apeMaterno}`
    }
  }
  Usuario.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },
      nombre: DataTypes.STRING,
      apePaterno: DataTypes.STRING,
      apeMaterno: DataTypes.STRING,
      usuario: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
    },
    {
      sequelize,
      timestamps: true,
      tableName: "Usuario"
    }
  )
  return Usuario
}
