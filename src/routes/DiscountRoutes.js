const express = require('express');
const { getDiscounts, getAvailableDiscountsByDeal } = require('../controllers/DiscountController');

const router = express.Router();

router.get('/', getDiscounts);
router.get('/available', getAvailableDiscountsByDeal);

module.exports = router;
