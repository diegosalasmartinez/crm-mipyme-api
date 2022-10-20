const express = require('express');
const { getDeals, getDealDetail, getDealBasicInfo } = require('../controllers/DealController');

const router = express.Router();

router.get('/', getDeals);
router.get('/:idDeal', getDealDetail);
router.get('/:idDeal/basic', getDealBasicInfo);

module.exports = router;
