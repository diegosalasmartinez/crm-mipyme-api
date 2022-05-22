const db = require("../models/index")

const getVideos = async (req, res) => {
  const videos = await db.Video.findAll({ 
    include: {
      model: db.Channel,
      as: 'channel'
    }
  })
  res.status(201).json(videos)
}

const createVideo = async (req, res) => {
  const video = req.body
  const videoCreated = await db.Video.create({
    name: video.name,
    channelId: video.channelId
  })
  res.status(201).json(videoCreated)
}

module.exports = {
  getVideos,
  createVideo
}
