const express = require('express');
const {
  getQuotationById,
  addQuotation,
  updateQuotation,
} = require('../controllers/QuotationController');

const router = express.Router();

router.get('/:idQuotation', getQuotationById);
router.post('/', addQuotation);
router.patch('/', updateQuotation);

module.exports = router;
