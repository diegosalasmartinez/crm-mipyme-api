const express = require('express');
const {
  getDeals,
  createDeal,
  getDealDetail,
  getDealBasicInfo,
  updateDealStep,
  dashboard,
  updateDeal,
  seed_addDeals
} = require('../controllers/DealController');

const router = express.Router();

router.get('/', getDeals);
router.get('/dashboard', dashboard);
router.post('/', createDeal);
router.patch('/', updateDeal);
router.get('/:idDeal', getDealDetail);
router.get('/:idDeal/basic', getDealBasicInfo);
router.post('/update/step', updateDealStep);
// Commands
router.post('/job/bulk', seed_addDeals);

module.exports = router;
