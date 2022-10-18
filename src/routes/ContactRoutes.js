const express = require("express")
const { getContacts, convertLeadThroughCampaign } = require("../controllers/ContactController")

const router = express.Router()

router.get("/", getContacts)
router.post("/convert", convertLeadThroughCampaign)

module.exports = router
