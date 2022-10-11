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
const planRoutes = require('./PlanRoutes');
const programRoutes = require('./ProgramRoutes');
authenticatedRoutes.use(baseUrl + 'companies', companyRoutes);
authenticatedRoutes.use(baseUrl + 'users', usersRoutes);
authenticatedRoutes.use(baseUrl + 'leads', leadRoutes);
authenticatedRoutes.use(baseUrl + 'lists', listRoutes);
authenticatedRoutes.use(baseUrl + 'plans', planRoutes);
authenticatedRoutes.use(baseUrl + 'programs', programRoutes);

module.exports = {
  basicRoutes,
  authenticatedRoutes,
};
