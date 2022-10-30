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

module.exports = {
  getDiscounts,
  getAvailableDiscountsByDeal,
};
