const { StatusCodes } = require('http-status-codes');
const ArticleService = require('../services/ArticleService');
const articleService = new ArticleService();

const getArticles = async (req, res) => {
  const { page, rowsPerPage } = req.query;
  const { idCompany } = req.user;
  const { data, count } = await articleService.getArticles(idCompany, page, rowsPerPage);
  res.status(StatusCodes.OK).json({ data, count });
};

const getArticleById = async (req, res) => {
  const { idArticle } = req.params;
  const article = await articleService.getArticleById(idArticle);
  res.status(StatusCodes.OK).json(article);
};

const getArticlesByType = async (req, res) => {
  const { idCompany } = req.user;
  const { idType } = req.params;
  const articles = await articleService.getArticleById(idCompany, idType);
  res.status(StatusCodes.OK).json(articles);
};

const addArticle = async (req, res) => {
  const { id: idUser } = req.user;
  const article = req.body;
  const articleCreated = await articleService.addArticle(idUser, article);
  res.status(StatusCodes.OK).json(articleCreated);
};

module.exports = {
  getArticles,
  getArticlesByType,
  getArticleById,
  addArticle,
};
