/* eslint-disable no-unused-vars */
'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('deal_origin', [
      {
        id: uuidv4(),
        key: 'ticket',
        name: 'Solicitud de servicio',
      },
      {
        id: uuidv4(),
        key: 'campaign',
        name: 'Campaña de marketing',
      },
      {
        id: uuidv4(),
        key: 'sales',
        name: 'Captación de ventas',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('deal_origin', null, {});
  },
};
