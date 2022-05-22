const express = require("express")
const { getChannels, createChannel } = require("../controllers/ChannelController")

const router = express.Router()

router.get("/", getChannels)
router.post("/", createChannel)

module.exports = router
