'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.belongsTo(models.Company, { foreignKey: 'idCompany' });
      this.hasMany(
        models.List,
        { foreignKey: 'createdBy' },
        {
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        }
      );
      this.hasMany(
        models.Campaign,
        { foreignKey: 'createdBy' },
        {
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        }
      );
    }
    async setPassword() {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    async comparePassword(password) {
      return await bcrypt.compare(password, this.password);
    }
    async createJWT() {
      return jwt.sign(
        { userId: this.id, idCompany: this.idCompany },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_LIFETIME,
        }
      );
    }
    getFullName() {
      return `${this.name} ${this.lastName}`;
    }
  }
  User.init(
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
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
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
      tableName: 'users',
    }
  );
  return User;
};
