const express = require('express');
const {
  getLists,
  getAvailableLeads,
  getListDetail,
  getLeadsOfList,
  addList,
  addLeadsToList,
  removeLeadFromList,
  getListSimple,
  updateList,
} = require('../controllers/ListController');

const router = express.Router();

router.get('/', getLists);
router.get('/simple/:idList', getListSimple);
router.get('/:idList', getListDetail);
router.get('/:idList/leads', getLeadsOfList);
router.get('/:idList/leads/available', getAvailableLeads);
router.post('/', addList);
router.post('/add_leads', addLeadsToList);
router.post('/remove_lead', removeLeadFromList);
router.patch('/', updateList);

module.exports = router;
