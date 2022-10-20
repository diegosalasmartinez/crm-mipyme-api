const express = require('express');
const { getLists, getListDetail, addList, addLeadsToList } = require('../controllers/ListController');

const router = express.Router();

router.get('/', getLists);
router.get('/:idList', getListDetail);
router.post('/', addList);
router.post('/add_leads', addLeadsToList);

module.exports = router;
