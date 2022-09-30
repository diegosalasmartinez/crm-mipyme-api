const express = require("express")
const { getUsers } = require("../controllers/UserController")

const router = express.Router()

router.get("/", getUsers)

module.exports = router
