/* eslint-disable no-unused-vars */
'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('discount_type', [
      {
        id: uuidv4(),
        key: 'marketing',
        name: 'Marketing',
      },
      {
        id: uuidv4(),
        key: 'sales',
        name: 'Ventas',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('discount_type', null, {});
  },
};
