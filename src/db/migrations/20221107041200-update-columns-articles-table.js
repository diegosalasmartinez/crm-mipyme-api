'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('articles', 'subject');
    await queryInterface.removeColumn('articles', 'body');
    await queryInterface.addColumn('articles', 'title', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('articles', 'text', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('articles', 'subject', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('articles', 'body', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.removeColumn('articles', 'title');
    await queryInterface.removeColumn('articles', 'text');
  },
};
