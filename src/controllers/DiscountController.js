const { StatusCodes } = require('http-status-codes');
const DiscountService = require('../services/DiscountService');
const discountService = new DiscountService();

const getDiscounts = async (req, res) => {
  const { page, rowsPerPage } = req.query;
  const { idCompany } = req.user;
  const { data, count } = await discountService.getDiscounts(idCompany, page, rowsPerPage);
  res.status(StatusCodes.OK).json({ data, count });
};

const getAvailableDiscountsByDeal = async (req, res) => {
  const { idCompany } = req.user;
  const { idDeal } = req.query;
  const discounts = await discountService.getAvailableDiscountsByDeal(idDeal, idCompany);
  res.status(StatusCodes.OK).json(discounts);
};

const createDiscounts = async (req, res) => {
  const { idCompany } = req.user;
  const { discounts } = req.body;
  await discountService.addBulkDiscounts(idCompany, discounts, 'sales');
  res.status(StatusCodes.OK).json({ message: 'Los descuentos se crearon correctamente' });
};

module.exports = {
  getDiscounts,
  getAvailableDiscountsByDeal,
  createDiscounts,
};
