const { sequelize } = require("../db/models/index")
const db = require("../db/models/index")
const { BadRequestError } = require('../errors')

const listarUsuarios = async (req, res) => {
  const { page = 0, rowsPerPage = 10 } = req.query
  const usuarios = await db.Usuario.findAll({
    offset: page * rowsPerPage,
    limit: rowsPerPage,
    where: {
      activo: true
    },
    attributes: {
      exclude: [ 'password', 'activo' ]
    }
    // include: {
    //   model: db.EmpresaUsuario,
    //   as: 'empresa_usuario'
    // }
  })
  const count = await db.Usuario.count({
    where: {
      activo: true
    }
  })
  res.status(200).json({ data: usuarios, count })
}

const agregarUsuario = async (req, res) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const datosUsuario = req.body
      const usuarioBulk = db.Usuario.build({
        nombre: datosUsuario.nombre,
        apePaterno: datosUsuario.apePaterno,
        apeMaterno: datosUsuario.apeMaterno,
        usuario: datosUsuario.usuario,
        password: datosUsuario.password,
        email: datosUsuario.email
      })

      await usuarioBulk.setPassword()
      const usuario = await usuarioBulk.save({ transaction: t })
    
      await db.EmpresaUsuario.create({
        empresaId: datosUsuario.empresaId,
        usuarioId: usuario.id
      }, { transaction: t })

      return usuario.nombre
    })
    res.status(201).json({ message: `Usuario (${result}) creado` })
  } catch (e) {
    throw new BadRequestError(`No se pudo registrar al usuario: ${e.message}`)
  }
}

module.exports = {
  listarUsuarios,
  agregarUsuario,
}
