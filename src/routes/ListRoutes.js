const express = require('express');
const {
  getLists,
  getListDetail,
  getLeadsOfList,
  addList,
  addLeadsToList,
} = require('../controllers/ListController');

const router = express.Router();

router.get('/', getLists);
router.get('/:idList', getListDetail);
router.get('/:idList/leads', getLeadsOfList);
router.post('/', addList);
router.post('/add_leads', addLeadsToList);

module.exports = router;
