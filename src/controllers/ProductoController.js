const db = require("../models/index")

const obtenerProductos = async (req, res) => {
  for (let index = 0; index < 5000; index++) {
   console.log(index) 
  }
  
  const productos = await db.Producto.findAll()
  res.status(200).json(productos)
}

const agregarProducto = async (req, res) => {
  const producto = req.body
  const productoCreated = await db.Producto.create({
    // name: user.name,
    // firstName: user.firstName,
    // lastName: user.lastName,
    // email: user.email
  })
  res.status(201).json(productoCreated)
}

module.exports = {
  obtenerProductos,
  agregarProducto
}
