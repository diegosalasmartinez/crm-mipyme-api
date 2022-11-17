'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.belongsTo(models.Company, { foreignKey: 'idCompany', as: 'company' });
      this.hasMany(models.Rejection, { foreignKey: 'createdBy' });
      this.hasMany(models.List, { foreignKey: 'createdBy' });
      this.hasMany(models.Campaign, { foreignKey: 'createdBy' });
      this.hasMany(models.Campaign, { foreignKey: 'approvedBy' });
      this.hasMany(models.Contact, { foreignKey: 'assignedTo' });
      this.hasMany(models.Ticket, { foreignKey: 'assignedTo', as: 'tickets' });
      this.belongsToMany(models.Role, {
        foreignKey: 'idUser',
        as: 'roles',
        through: 'usersxroles',
      });
      this.belongsToMany(models.Campaign, {
        foreignKey: 'idUser',
        as: 'campaigns',
        through: 'usersxcampaigns',
      });
    }
    async setPassword() {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    async comparePassword(password) {
      return await bcrypt.compare(password, this.password);
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
