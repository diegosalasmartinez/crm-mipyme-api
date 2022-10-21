const express = require('express');
const { addQuotation } = require('../controllers/QuotationController');

const router = express.Router();

router.post('/', addQuotation);

module.exports = router;
