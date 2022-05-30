const db = require("../models/index")

const obtenerProductos = async (req, res) => {
  const productos = await db.Producto.findAll()
  res.status(200).json(productos)
}

const obtenerProducto = async (req, res) => {
  const { idProducto } = req.params
  const producto = await db.Producto.findByPk(idProducto)
  res.status(200).json(producto)
}

const agregarProducto = async (req, res) => {
  const producto = req.body
  const productoCreated = await db.Producto.create({
    nombre: producto.nombre,
    codigo: producto.codigo,
    descripcion: producto.descripcion,
    precioUnidad: producto.precioUnidad
  })
  res.status(201).json({ message: `Producto (${producto.nombre}) creado` })
}

const editarProducto = async (req, res) => {
  const producto = req.body
  const updateValues = {
    nombre: producto.nombre,
    codigo: producto.codigo,
    descripcion: producto.descripcion,
    precioUnidad: producto.precioUnidad
  }
  await db.Producto.update(updateValues, { where: { id: producto.id }})
  res.status(200).json({ message: `Producto (${producto.nombre}) actualizado` })
}

module.exports = {
  obtenerProductos,
  obtenerProducto,
  agregarProducto,
  editarProducto
}
