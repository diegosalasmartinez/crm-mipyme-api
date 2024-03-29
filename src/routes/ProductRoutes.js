const express = require('express');
const {
  getProducts,
  getProductBySku,
  addProducts,
  seed_addProducts,
  getBestProductsByDeal,
} = require('../controllers/ProductController');

const router = express.Router();

router.get('/', getProducts);
router.get('/search/:sku', getProductBySku);
router.get('/generate', seed_addProducts);
router.get('/best/:idDeal', getBestProductsByDeal);
router.post('/', addProducts);

module.exports = router;
