/* eslint-disable no-unused-vars */
'use strict';
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface, Sequelize) {
    const leadsInfo = [];
    for (let i = 0; i < 10; i++) {
      const info = {
        id: uuidv4(),
        name: faker.name.firstName(),
        lastName: faker.name.lastName(),
        birthday: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: faker.address.secondaryAddress(),
        createdBy: process.env.ADMIN_USER_ID,
      };
      leadsInfo.push(info);
    }
    const companies = await queryInterface.bulkInsert('leads', leadsInfo);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('leads', null, {});
  },
};
