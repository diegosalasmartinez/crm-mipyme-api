const express = require('express');
const { getProducts, getProductBySku, addProduct, seed_addProducts } = require('../controllers/ProductController');

const router = express.Router();

router.get('/', getProducts);
router.get('/search/:sku', getProductBySku);
router.get('/generate', seed_addProducts);
router.post('/', addProduct);

module.exports = router;
