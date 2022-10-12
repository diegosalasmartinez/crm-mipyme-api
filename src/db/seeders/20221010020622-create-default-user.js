/* eslint-disable no-unused-vars */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        id: process.env.ADMIN_USER_ID,
        name: 'Diego',
        lastName: 'Salas Martinez',
        email: 'diesalasmart@gmail.com',
        password: process.env.ADMIN_USER_PASSWORD,
        idCompany: process.env.DEFAULT_COMPANY,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
