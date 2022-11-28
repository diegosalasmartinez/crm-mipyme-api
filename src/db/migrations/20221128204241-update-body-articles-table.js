'use strict';

module.exports = {
  // eslint-disable-next-line no-unused-vars
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('articles', 'text', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },
  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('articles', 'text', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
