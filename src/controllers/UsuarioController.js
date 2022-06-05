const db = require("../db/models/index")

const obtenerUsuarios = async (req, res) => {
  const { page = 0, rowsPerPage = 10 } = req.query
  const usuarios = await db.Usuario.findAll({
    offset: page * rowsPerPage,
    limit: rowsPerPage,
    where: {
      activo: true
    }
  })
  const count = await db.Usuario.count({
    where: {
      activo: true
    }
  })
  res.status(200).json({ data: usuarios, count })
}

const agregarUsuario = async (req, res) => {
  const datosUsuario = req.body
  const usuario = db.Usuario.build({
    nombre: datosUsuario.nombre,
    apePaterno: datosUsuario.apePaterno,
    apeMaterno: datosUsuario.apeMaterno,
    usuario: datosUsuario.usuario,
    password: datosUsuario.password,
    email: datosUsuario.email,
    empresaId: datosUsuario.empresaId
  })
  await usuario.setPassword()
  await usuario.save()

  res.status(201).json({ message: `Usuario (${usuario.nombre}) creado` })
}

module.exports = {
  obtenerUsuarios,
  agregarUsuario,
}
