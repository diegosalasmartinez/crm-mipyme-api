const express = require("express")
const { listarUsuarios, agregarUsuario } = require("../controllers/UsuarioController")

const router = express.Router()

router.get("/", listarUsuarios)
router.post("/", agregarUsuario)

module.exports = router
