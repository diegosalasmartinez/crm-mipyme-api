const express = require('express');
const {
  getQuotations,
  getQuotationById,
  addQuotation,
  updateQuotation,
  approveQuotation,
  generatePDF,
  sendPDF,
} = require('../controllers/QuotationController');

const router = express.Router();

router.get('/', getQuotations);
router.get('/:idQuotation', getQuotationById);
router.get('/:idQuotation/pdf', generatePDF);
router.post('/:idQuotation/pdf', sendPDF);
router.post('/', addQuotation);
router.patch('/', updateQuotation);
router.post('/approve', approveQuotation);

module.exports = router;
