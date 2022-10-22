/* eslint-disable no-unused-vars */
'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('lost_type', [
      {
        id: uuidv4(),
        key: 'too_much_time',
        name: 'Demoró mucho',
      },
      {
        id: uuidv4(),
        key: 'bad_offer',
        name: 'Mala oferta',
      },
      {
        id: uuidv4(),
        key: 'competence',
        name: 'Pérdida por la competencia',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('lost_type', null, {});
  },
};
