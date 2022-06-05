const db = require("../db/models/index")

const obtenerProductos = async (req, res) => {
  const { page = 0, rowsPerPage = 10 } = req.query
  const productos = await db.Producto.findAll({
    offset: page * rowsPerPage,
    limit: rowsPerPage,
    where: {
      activo: true
    }
  })
  const count = await db.Producto.count({
    where: {
      activo: true
    }
  })

  res.status(200).json({ data: productos, count })
}

const obtenerProducto = async (req, res) => {
  const { idProducto } = req.params
  const producto = await db.Producto.findByPk(idProducto)
  res.status(200).json(producto)
}

const agregarProducto = async (req, res) => {
  const producto = req.body
  await db.Producto.create({
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

const eliminarProducto = async (req, res) => {
  const { idProducto } = req.params
  const { nombre } = req.query
  await db.Producto.update({ activo: false }, { where: { id: idProducto }})
  res.status(200).json({ message: `Producto (${nombre}) eliminado` })
}

module.exports = {
  obtenerProductos,
  obtenerProducto,
  agregarProducto,
  editarProducto,
  eliminarProducto
}
