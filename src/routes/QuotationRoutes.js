const express = require('express');
const {
  getQuotations,
  getQuotationById,
  addQuotation,
  updateQuotation,
  approveQuotation
} = require('../controllers/QuotationController');

const router = express.Router();

router.get('/', getQuotations);
router.get('/:idQuotation', getQuotationById);
router.post('/', addQuotation);
router.patch('/', updateQuotation);
router.post('/approve', approveQuotation);

module.exports = router;
