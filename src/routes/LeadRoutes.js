const express = require('express');
const { getLeads, addLead } = require('../controllers/LeadController');

const router = express.Router();

router.get('/', getLeads);
router.post('/', addLead);

module.exports = router;
