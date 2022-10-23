const express = require('express');
const {
  getLeads,
  getLeadById,
  addLead,
  addLeadBulk,
  seed_addLeads,
} = require('../controllers/LeadController');

const router = express.Router();

router.get('/', getLeads);
router.get('/generate', seed_addLeads);
router.get('/:idLead', getLeadById);
router.post('/', addLead);
router.post('/bulk', addLeadBulk);

module.exports = router;
