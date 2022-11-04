const express = require('express');
const {
  getLeads,
  getLeadById,
  getLeadSimple,
  addLead,
  updateLead,
  validateLead,
  addLeadBulk,
  seed_addLeads,
} = require('../controllers/LeadController');

const router = express.Router();

router.get('/', getLeads);
router.get('/generate', seed_addLeads);
router.get('/simple/:idLead', getLeadSimple);
router.get('/:idLead', getLeadById);
router.post('/', addLead);
router.patch('/', updateLead);
router.patch('/validate', validateLead);
router.post('/bulk', addLeadBulk);

module.exports = router;
