"use strict"
const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    static associate(models) {
      this.belongsTo(models.Channel, { foreignKey: 'channelId', as: 'channel' })
    }
  }
  Video.init(
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
      tableName: "Video"
    }
  )
  return Video
}
