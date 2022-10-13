const express = require('express');
const {
  getProducts,
  addProduct,
  seed_addProducts
} = require('../controllers/ProductController');

const router = express.Router();

router.get('/', getProducts);
router.get('/generate', seed_addProducts);
router.post('/', addProduct);

module.exports = router;
