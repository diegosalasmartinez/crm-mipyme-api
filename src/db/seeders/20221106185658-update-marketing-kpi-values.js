/* eslint-disable no-unused-vars */
'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      'marketing_kpi',
      { key: ['qty_new_leads', 'qty_lost_leads'] },
      {}
    );
    await queryInterface.bulkInsert('marketing_kpi', [
      {
        id: uuidv4(),
        key: 'fidelization',
        name: 'Fidelización de leads',
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('marketing_kpi', { key: 'fidelization' }, {});
    await queryInterface.bulkInsert('marketing_kpi', [
      {
        id: uuidv4(),
        key: 'qty_new_leads',
        name: 'Número de nuevos leads',
      },
      {
        id: uuidv4(),
        key: 'qty_lost_leads',
        name: 'Leads perdidos',
      },
    ]);
  },
};
