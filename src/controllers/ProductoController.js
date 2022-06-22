const db = require("../db/models/index")
const { StatusCodes } = require("http-status-codes")

const listarProductos = async (req, res) => {
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

  res.status(StatusCodes.OK).json({ data: productos, count })
}

const mostrarProducto = async (req, res) => {
  const { idProducto } = req.params
  const producto = await db.Producto.findByPk(idProducto)
  res.status(StatusCodes.OK).json(producto)
}

const agregarProducto = async (req, res) => {
  const producto = req.body
  await db.Producto.create({
    nombre: producto.nombre,
    codigo: producto.codigo,
    descripcion: producto.descripcion,
    precioUnidad: producto.precioUnidad
  })
  res.status(StatusCodes.CREATED).json({ message: `Producto (${producto.nombre}) creado` })
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
  res.status(StatusCodes.OK).json({ message: `Producto (${producto.nombre}) actualizado` })
}

const eliminarProducto = async (req, res) => {
  const { idProducto } = req.params
  const { nombre } = req.query
  await db.Producto.update({ activo: false }, { where: { id: idProducto }})
  res.status(StatusCodes.OK).json({ message: `Producto (${nombre}) eliminado` })
}

module.exports = {
  listarProductos,
  mostrarProducto,
  agregarProducto,
  editarProducto,
  eliminarProducto
}
