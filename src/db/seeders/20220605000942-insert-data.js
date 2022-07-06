'use strict'
const { v4: uuidv4 } = require('uuid')

module.exports = {
  async up (queryInterface, Sequelize) {
    const empresas = await queryInterface.bulkInsert('Empresa', [{
      id: uuidv4(),
      nombre: 'Tambo',
      direccion: 'Urb A Calle B',
      telefono: '555-5555',
      activo: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], { returning: true })
    const usuarios = await queryInterface.bulkInsert('Usuario', [{
      id: uuidv4(),
      nombre: 'Diego',
      apePaterno: 'Salas',
      apeMaterno: 'Martinez',
      usuario: 'diego',
      password: process.env.TEST_USER_PASSWORD,
      email: 'diesalasmart@gmail.com',
      activo: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], { returning: true })
    await queryInterface.bulkInsert('EmpresaUsuario', [{
      id: uuidv4(),
      usuarioId: usuarios[0].id,
      empresaId: empresas[0].id,
      activo: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('EmpresaUsuario', null, {})
    await queryInterface.bulkDelete('Empresa', null, {})
    await queryInterface.bulkDelete('Usuario', null, {})
  }
}
