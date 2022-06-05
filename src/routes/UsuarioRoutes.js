const express = require("express")
const { obtenerUsuarios, agregarUsuario } = require("../controllers/UsuarioController")

const router = express.Router()

router.get("/", obtenerUsuarios)
router.post("/", agregarUsuario)

module.exports = router
