/* eslint-disable no-unused-vars */
'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ticket_status', [
      {
        id: uuidv4(),
        key: 'assigned',
        name: 'Asignado',
      },
      {
        id: uuidv4(),
        key: 'pending',
        name: 'En proceso',
      },
      {
        id: uuidv4(),
        key: 'closed',
        name: 'Terminado',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ticket_status', null, {});
  },
};
