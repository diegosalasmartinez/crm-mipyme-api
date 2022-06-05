'use strict'
const { v4: uuidv4 } = require('uuid')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Empresa', [{
      id: uuidv4(),
      nombre: 'Tambo',
      direccion: 'Urb A Calle B',
      telefono: '555-5555',
      activo: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Empresa', null, {})
  }
}
