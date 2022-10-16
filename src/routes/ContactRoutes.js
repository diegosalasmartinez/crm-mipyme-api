const express = require("express")
const { convertLeadThroughCampaign } = require("../controllers/ContactController")

const router = express.Router()

router.post("/convert", convertLeadThroughCampaign)

module.exports = router
