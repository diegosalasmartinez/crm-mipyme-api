/* eslint-disable no-unused-vars */
'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ticket_type', [
      {
        id: uuidv4(),
        key: 'question',
        name: 'Consulta',
      },
      {
        id: uuidv4(),
        key: 'quotation',
        name: 'Cotización',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ticket_type', null, {});
  },
};
