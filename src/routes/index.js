const express = require('express')
const basicRoutes = express.Router()
const authenticatedRoutes = express.Router()

const baseUrl = "/api/v1"

const authRoutes = require('./AuthRoutes')
basicRoutes.use(baseUrl + 'auth', authRoutes)

const leadRoutes = require('./LeadRoutes')
authenticatedRoutes.use(baseUrl + 'leads', leadRoutes)

module.exports = {
  basicRoutes,
  authenticatedRoutes,
}
