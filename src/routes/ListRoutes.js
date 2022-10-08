const express = require("express")
const { getLists, getListDetail, addList } = require("../controllers/ListController")

const router = express.Router()

router.get("/", getLists)
router.get("/:idList", getListDetail)
router.post("/", addList)

module.exports = router
