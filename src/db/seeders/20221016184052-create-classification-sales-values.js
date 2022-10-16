/* eslint-disable no-unused-vars */
'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('classification_sales', [
      {
        id: uuidv4(),
        key: 'started',
        name: 'Sin procesar',
      },
      {
        id: uuidv4(),
        key: 'ready_marketing',
        name: 'Listo para marketing',
      },
      {
        id: uuidv4(),
        key: 'marketing_engaged',
        name: 'Marketing comprometido',
      },
      {
        id: uuidv4(),
        key: 'ready_sales',
        name: 'Listo para venta',
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('classification_sales', null, {});
  }
};
