const express = require("express")
const { getDeals, getDealDetail } = require("../controllers/DealController")

const router = express.Router()

router.get("/", getDeals)
router.get("/:idDeal", getDealDetail)

module.exports = router
