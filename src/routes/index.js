const express = require('express');
const basicRoutes = express.Router();
const authenticatedRoutes = express.Router();

const baseUrl = '/api/v1/';

const authRoutes = require('./AuthRoutes');
basicRoutes.use(baseUrl + 'auth', authRoutes);

const companyRoutes = require('./CompanyRoutes');
const usersRoutes = require('./UserRoutes');
const leadRoutes = require('./LeadRoutes');
const listRoutes = require('./ListRoutes');
authenticatedRoutes.use(baseUrl + 'companies', companyRoutes);
authenticatedRoutes.use(baseUrl + 'users', usersRoutes);
authenticatedRoutes.use(baseUrl + 'leads', leadRoutes);
authenticatedRoutes.use(baseUrl + 'lists', listRoutes);

module.exports = {
  companyRoutes,
  basicRoutes,
  authenticatedRoutes,
};
