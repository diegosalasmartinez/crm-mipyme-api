/* eslint-disable no-unused-vars */
'use strict';
require('dotenv').config();

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('companies', [
      {
        id: process.env.DEFAULT_COMPANY,
        name: 'Tambo',
        email: 'tambo@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('companies', null, {});
  },
};
