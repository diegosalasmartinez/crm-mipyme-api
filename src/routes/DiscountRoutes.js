const express = require('express');
const {
  getDiscounts,
  getAvailableDiscountsByDeal,
  createDiscounts,
} = require('../controllers/DiscountController');

const router = express.Router();

router.get('/', getDiscounts);
router.get('/available', getAvailableDiscountsByDeal);
router.post('/', createDiscounts);

module.exports = router;
