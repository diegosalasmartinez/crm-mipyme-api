const express = require('express');
const {
  getDeals,
  getDealDetail,
  getDealBasicInfo,
  updateDealStep,
} = require('../controllers/DealController');

const router = express.Router();

router.get('/', getDeals);
router.get('/:idDeal', getDealDetail);
router.get('/:idDeal/basic', getDealBasicInfo);
router.post('/update/step', updateDealStep);

module.exports = router;
