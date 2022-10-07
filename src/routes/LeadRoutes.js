const express = require('express');
const { getLeads } = require('../controllers/LeadController');

const router = express.Router();

router.get('/', getLeads);

module.exports = router;
