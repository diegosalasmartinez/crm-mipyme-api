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
  seed_updateLeadsToRM
} = require('../controllers/LeadController');

const router = express.Router();

router.get('/', getLeads);
router.get('/simple/:idLead', getLeadSimple);
router.get('/:idLead', getLeadById);
router.post('/', addLead);
router.patch('/', updateLead);
router.patch('/validate', validateLead);
router.post('/bulk', addLeadBulk);
// Commands
router.post('/job/bulk', seed_addLeads);
router.post('/job/update_rm', seed_updateLeadsToRM);

module.exports = router;
