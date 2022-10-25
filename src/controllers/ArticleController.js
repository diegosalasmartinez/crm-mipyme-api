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
  const { type } = req.params;
  const articles = await articleService.getArticlesByType(idCompany, type);
  res.status(StatusCodes.OK).json(articles);
};

const addArticle = async (req, res) => {
  const { id: idUser } = req.user;
  const article = req.body;
  await articleService.addArticle(idUser, article);
  res.status(StatusCodes.OK).json({ message: `El artículo ${article.title} ha sido registrado` });
};

module.exports = {
  getArticles,
  getArticlesByType,
  getArticleById,
  addArticle,
};
