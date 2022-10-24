/* eslint-disable no-unused-vars */
'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('activity_status', [
      {
        id: uuidv4(),
        key: 'created',
        name: 'Creado',
      },
      {
        id: uuidv4(),
        key: 'pending',
        name: 'En proceso',
      },
      {
        id: uuidv4(),
        key: 'closed',
        name: 'Finalizado',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('activity_status', null, {});
  },
};
