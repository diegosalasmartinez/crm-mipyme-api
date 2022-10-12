/* eslint-disable no-unused-vars */
'use strict';
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up (queryInterface, Sequelize) {
    const companies = await queryInterface.bulkInsert('classification_marketing', [
      {
        id: process.env.MARKETING_CLASSIFICATION_DEFAULT,
        key: 'started',
        name: 'Sin procesar',
        minPoints: 0,
        maxPoints: 20
      },
      {
        id: uuidv4(),
        key: 'ready_marketing',
        name: 'Listo para marketing',
        minPoints: 20,
        maxPoints: 50
      },
      {
        id: uuidv4(),
        key: 'marketing_engaged',
        name: 'Marketing comprometido',
        minPoints: 50,
        maxPoints: 200
      },
      {
        id: uuidv4(),
        key: 'ready_sales',
        name: 'Listo para venta',
        minPoints: 200,
        maxPoints: 500
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('classification_marketing', null, {});
  }
};
