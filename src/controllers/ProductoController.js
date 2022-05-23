const db = require("../models/index")

const obtenerProductos = async (req, res) => {
  const productos = await db.Producto.findAll()
  res.status(200).json(productos)
}

const agregarProducto = async (req, res) => {
  const producto = req.body
  const productoCreated = await db.Producto.create({
    nombre: producto.nombre,
    codigo: producto.codigo,
    descripcion: producto.descripcion,
    precioUnidad: producto.precioUnidad
  })
  res.status(201).json(productoCreated)
}

module.exports = {
  obtenerProductos,
  agregarProducto
}
