/* eslint-disable no-unused-vars */
'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('campaign_status', [
      {
        id: uuidv4(),
        key: 'bulk',
        name: 'Borrador',
      },
      {
        id: uuidv4(),
        key: 'pending',
        name: 'Pendiente',
      },
      {
        id: uuidv4(),
        key: 'approved',
        name: 'Aprobado',
      },
      {
        id: uuidv4(),
        key: 'rejected',
        name: 'Rechazado',
      },
      {
        id: uuidv4(),
        key: 'running',
        name: 'En curso',
      },
      {
        id: uuidv4(),
        key: 'finished',
        name: 'Finalizado',
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('campaign_status', null, {});
  }
};
