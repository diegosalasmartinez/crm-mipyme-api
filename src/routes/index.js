const express = require('express');
const basicRoutes = express.Router();
const authenticatedRoutes = express.Router();

const baseUrl = '/api/v1/';

const authRoutes = require('./AuthRoutes');
const externalRoutes = require('./ExternalRoutes');
basicRoutes.use(baseUrl + 'auth', authRoutes);
basicRoutes.use(baseUrl + 'external', externalRoutes);

const accountRoutes = require('./AccountRoutes');
const companyRoutes = require('./CompanyRoutes');
const productRoutes = require('./ProductRoutes');
const usersRoutes = require('./UserRoutes');
const leadRoutes = require('./LeadRoutes');
const contactRoutes = require('./ContactRoutes');
const formRoutes = require('./FormRoutes');
const listRoutes = require('./ListRoutes');
const planRoutes = require('./PlanRoutes');
const programRoutes = require('./ProgramRoutes');
const campaignRoutes = require('./CampaignRoutes');
const dealRoutes = require('./DealRoutes');
const quotationRoutes = require('./QuotationRoutes');
const activityRoutes = require('./ActivityRoutes');
const ticketRoutes = require('./TicketRoutes');
const articleRoutes = require('./ArticleRoutes');
const rejectionRoutes = require('./RejectionRoutes');
const discountRoutes = require('./DiscountRoutes');
const noteRoutes = require('./NoteRoutes');
authenticatedRoutes.use(baseUrl + 'account', accountRoutes);
authenticatedRoutes.use(baseUrl + 'companies', companyRoutes);
authenticatedRoutes.use(baseUrl + 'products', productRoutes);
authenticatedRoutes.use(baseUrl + 'users', usersRoutes);
authenticatedRoutes.use(baseUrl + 'leads', leadRoutes);
authenticatedRoutes.use(baseUrl + 'contacts', contactRoutes);
authenticatedRoutes.use(baseUrl + 'forms', formRoutes);
authenticatedRoutes.use(baseUrl + 'lists', listRoutes);
authenticatedRoutes.use(baseUrl + 'plans', planRoutes);
authenticatedRoutes.use(baseUrl + 'programs', programRoutes);
authenticatedRoutes.use(baseUrl + 'campaigns', campaignRoutes);
authenticatedRoutes.use(baseUrl + 'deals', dealRoutes);
authenticatedRoutes.use(baseUrl + 'quotations', quotationRoutes);
authenticatedRoutes.use(baseUrl + 'activities', activityRoutes);
authenticatedRoutes.use(baseUrl + 'tickets', ticketRoutes);
authenticatedRoutes.use(baseUrl + 'articles', articleRoutes);
authenticatedRoutes.use(baseUrl + 'rejections', rejectionRoutes);
authenticatedRoutes.use(baseUrl + 'discounts', discountRoutes);
authenticatedRoutes.use(baseUrl + 'notes', noteRoutes);

module.exports = {
  basicRoutes,
  authenticatedRoutes,
};
