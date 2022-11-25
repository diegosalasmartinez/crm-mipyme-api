const express = require('express');
const {
  getDeals,
  createDeal,
  getDealDetail,
  getDealBasicInfo,
  updateDealStep,
  dashboard,
  updateDeal
} = require('../controllers/DealController');

const router = express.Router();

router.get('/', getDeals);
router.get('/dashboard', dashboard);
router.post('/', createDeal);
router.patch('/', updateDeal);
router.get('/:idDeal', getDealDetail);
router.get('/:idDeal/basic', getDealBasicInfo);
router.post('/update/step', updateDealStep);

module.exports = router;
