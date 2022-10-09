const express = require('express');
const { getLeads, getLeadById, addLead } = require('../controllers/LeadController');

const router = express.Router();

router.get('/', getLeads);
router.get('/:idLead', getLeadById);
router.post('/', addLead);

module.exports = router;
