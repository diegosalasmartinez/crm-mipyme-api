/* eslint-disable no-unused-vars */
'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('activity_type', [
      {
        id: uuidv4(),
        key: 'low',
        name: 'Bajo',
      },
      {
        id: uuidv4(),
        key: 'medium',
        name: 'Medio',
      },
      {
        id: uuidv4(),
        key: 'high',
        name: 'Alto',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('activity_type', null, {});
  },
};
