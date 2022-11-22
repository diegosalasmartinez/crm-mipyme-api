const { StatusCodes } = require('http-status-codes');
const ProductService = require('../services/ProductService');
const productService = new ProductService();
const QuotationService = require('../services/QuotationService');
const quotationService = new QuotationService();
const DealService = require('../services/DealService');
const dealService = new DealService();

const getProducts = async (req, res) => {
  const { page, rowsPerPage } = req.query;
  const { idCompany } = req.user;
  const { data, count } = await productService.getProducts(idCompany, page, rowsPerPage);
  res.status(StatusCodes.OK).json({ data, count });
};

const getProductBySku = async (req, res) => {
  const { idCompany } = req.user;
  const { sku } = req.params;
  const product = await productService.getProductBySku(idCompany, sku);
  res.status(StatusCodes.OK).json(product);
};

const addProducts = async (req, res) => {
  const { idCompany } = req.user;
  const { products } = req.body;
  await productService.addProducts(idCompany, products);
  res.status(StatusCodes.OK).json({ message: 'Se importaron los productos correctamente.' });
};

const getBestProductsByDeal = async (req, res) => {
  const { idDeal } = req.params;
  const deal = await dealService.getDealByIdSimple(idDeal);
  const quotations = await quotationService.getQuotationsAcceptedByLead(deal.contact.lead.id);
  const products = await productService.getProductsByQuotations(quotations);
  res.status(StatusCodes.OK).json(products);
};

const seed_addProducts = async (req, res) => {
  const { idCompany } = req.user;
  const { number } = req.query;
  await productService.seed_addProducts(idCompany, number);
  res.status(StatusCodes.OK).json({ message: 'Done' });
};

module.exports = {
  getProducts,
  getProductBySku,
  addProducts,
  getBestProductsByDeal,
  seed_addProducts,
};
