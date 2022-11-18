const express = require('express');
const {
  getDiscounts,
  getAvailableDiscountsByDeal,
  createDiscounts,
  runDiscountsJob
} = require('../controllers/DiscountController');

const router = express.Router();

router.get('/', getDiscounts);
router.get('/available', getAvailableDiscountsByDeal);
router.get('/run', runDiscountsJob);
router.post('/', createDiscounts);

module.exports = router;
