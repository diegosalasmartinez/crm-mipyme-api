const express = require('express');
const {
  getArticles,
  getArticleById,
  getArticlesByType,
  addArticle,
} = require('../controllers/ArticleController');

const router = express.Router();

router.get('/', getArticles);
router.get('/:idArticle', getArticleById);
router.get('/types/:idType', getArticlesByType);
router.post('/', addArticle);

module.exports = router;
