const express = require('express');
const { getDiscounts } = require('../controllers/DiscountController');

const router = express.Router();

router.get('/', getDiscounts);

module.exports = router;
