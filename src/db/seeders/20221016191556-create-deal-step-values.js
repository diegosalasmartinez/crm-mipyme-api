/* eslint-disable no-unused-vars */
'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('deal_step', [
      {
        id: uuidv4(),
        key: 'classification',
        name: 'Clasificacion',
      },
      {
        id: uuidv4(),
        key: 'quoted',
        name: 'Cotizado',
      },
      {
        id: uuidv4(),
        key: 'rejected',
        name: 'Rechazado',
      },
      {
        id: uuidv4(),
        key: 'negotiations',
        name: 'En negociacion',
      },
      {
        id: uuidv4(),
        key: 'won',
        name: 'Oportunidad ganada',
      },
      {
        id: uuidv4(),
        key: 'lost',
        name: 'Oportunidad perdida',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('deal_step', null, {});
  },
};
