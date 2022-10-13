const express = require('express');
const {
  getLeads,
  getLeadById,
  addLead,
  seed_addLeads,
} = require('../controllers/LeadController');

const router = express.Router();

router.get('/', getLeads);
router.get('/generate', seed_addLeads);
router.get('/:idLead', getLeadById);
router.post('/', addLead);

module.exports = router;
