/* eslint-disable no-unused-vars */
'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        id: uuidv4(),
        key: 'admin',
        name: 'Administrador',
      },
      {
        id: uuidv4(),
        key: 'marketing_admin',
        name: 'Jefe de marketing',
      },
      {
        id: uuidv4(),
        key: 'marketing',
        name: 'Usuario de marketing',
      },
      {
        id: uuidv4(),
        key: 'sales_admin',
        name: 'Jefe de ventas',
      },
      {
        id: uuidv4(),
        key: 'sales',
        name: 'Usuario de ventas',
      },
      {
        id: uuidv4(),
        key: 'services_admin',
        name: 'Jefe de servicios',
      },
      {
        id: uuidv4(),
        key: 'services',
        name: 'Usuario de servicios',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
