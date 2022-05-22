const express = require("express")
const { obtenerProductos, agregarProducto } = require("../controllers/ProductoController")

const router = express.Router()

router.get("/", obtenerProductos)
router.post("/", agregarProducto)

module.exports = router
