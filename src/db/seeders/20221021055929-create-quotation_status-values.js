/* eslint-disable no-unused-vars */
'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('quotation_status', [
      {
        id: uuidv4(),
        key: 'created',
        name: 'Creado',
      },
      {
        id: uuidv4(),
        key: 'pending',
        name: 'Pendiente',
      },
      {
        id: uuidv4(),
        key: 'rejected_user',
        name: 'Rechazado por usuario',
      },
      {
        id: uuidv4(),
        key: 'rejected_client',
        name: 'Rechazado por el cliente',
      },
      {
        id: uuidv4(),
        key: 'approved',
        name: 'Aprobado',
      },
      {
        id: uuidv4(),
        key: 'expired',
        name: 'Expirado',
      },
      {
        id: uuidv4(),
        key: 'accepted',
        name: 'Aceptado',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('quotation_status', null, {});
  },
};
