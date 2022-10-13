const { StatusCodes } = require('http-status-codes');
const ProductService = require('../services/ProductService');
const productService = new ProductService();

const getProducts = async (req, res) => {
  const { page, rowsPerPage } = req.query;
  const { idCompany } = req.user
  const { data, count } = await productService.getProducts(idCompany, page, rowsPerPage);
  res.status(StatusCodes.OK).json({ data, count });
};

const addProduct = async (req, res) => {
  const { idCompany } = req.user
  const product = req.body;
  const productCreated = await productService.addProduct(idCompany, product);
  res.status(StatusCodes.OK).json(productCreated);
};

const seed_addProducts = async (req, res) => {
  const { idCompany } = req.user;
  const { number } = req.query;
  await productService.seed_addLeads(idCompany, number)
  res.status(StatusCodes.OK).json({ message: 'Done'});
};

module.exports = {
  getProducts, 
  addProduct,
  seed_addProducts
};
