"use strict"
const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class Channel extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
      this.hasMany(models.Video, { foreignKey: 'channelId', as: 'videos'}, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
      })
    }
  }
  Channel.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },
      name: DataTypes.STRING
    },
    {
      sequelize,
      timestamps: true,
      tableName: "Channel"
    }
  )
  return Channel
}
