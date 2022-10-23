/* eslint-disable no-unused-vars */
'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('activity_type', [
      {
        id: uuidv4(),
        key: 'meet',
        name: 'Reunion',
      },
      {
        id: uuidv4(),
        key: 'task',
        name: 'Tarea',
      },
      {
        id: uuidv4(),
        key: 'call',
        name: 'Llamada',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('activity_type', null, {});
  },
};
