const db = require("../models/index")

const getChannels = async (req, res) => {
  const channels = await db.Channel.findAll({ 
    include: [
      {
        model: db.User,
        as: 'user'
      },
      {
        model: db.Video,
        as: 'videos',
        attributes: [ 'id', 'name' ]
      }
    ]
  })
  res.status(201).json(channels)
}

const createChannel = async (req, res) => {
  const channel = req.body
  const channelCreated = await db.Channel.create({
    name: channel.name,
    userId: channel.userId
  })
  res.status(201).json(channelCreated)
}

module.exports = {
  getChannels,
  createChannel
}
