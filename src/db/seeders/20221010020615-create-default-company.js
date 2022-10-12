/* eslint-disable no-unused-vars */
'use strict';
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const idCompany = uuidv4();
const idUser = process.env.ADMIN_USER_ID;

module.exports = {
  async up(queryInterface, Sequelize) {
    const companies = await queryInterface.bulkInsert('companies', [
      {
        id: idCompany,
        name: 'Tambo',
        email: 'tambo@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    await queryInterface.bulkInsert('users', [
      {
        id: idUser,
        name: 'Diego',
        lastName: 'Salas Martinez',
        email: 'diesalasmart@gmail.com',
        password: process.env.ADMIN_USER_PASSWORD,
        idCompany,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('companies', null, {});
  },
};
