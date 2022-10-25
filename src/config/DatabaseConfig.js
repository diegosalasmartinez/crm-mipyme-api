require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_NAME,
    host: process.env.DEV_DB_HOST,
    port: parseInt(process.env.DEV_DB_HOST),
    dialect: process.env.DEV_DB_DIALECT,
    logging: false,
    seederStorage: 'sequelize',
  },
  // "test": {
  //   "username": process.env.TEST_DB_USER,
  //   "password": process.env.TEST_DB_PASSWORD,
  //   "database": process.env.TEST_DB_NAME,
  //   "host": parseInt(process.env.TEST_DB_HOST),
  //   "dialect": process.env.TEST_DB_DIALECT
  // },
  // "production": {
  //   "username": process.env.PROD_DB_USER,
  //   "password": process.env.PROD_DB_PASSWORD,
  //   "database": process.env.PROD_DB_NAME,
  //   "host": parseInt(process.env.PROD_DB_HOST),
  //   "dialect": process.env.PROD_DB_DIALECT
  // }
};
