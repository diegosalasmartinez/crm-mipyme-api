const express = require("express")
const { getUsers, getUserById } = require("../controllers/UserController")

const router = express.Router()

router.get("/", getUsers)
router.get("/:idUser", getUserById)

module.exports = router
