const express = require("express")
const { obtenerProductos, obtenerProducto, agregarProducto, editarProducto, eliminarProducto } = require("../controllers/ProductoController")

const router = express.Router()

router.get("/", obtenerProductos)
router.get("/:idProducto", obtenerProducto)
router.post("/", agregarProducto)
router.patch("/", editarProducto)
router.delete("/:idProducto", eliminarProducto)

module.exports = router
