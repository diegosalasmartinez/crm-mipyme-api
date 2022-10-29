const { StatusCodes } = require('http-status-codes');
const DiscountService = require('../services/DiscountService');
const articleService = new DiscountService();

const getDiscounts = async (req, res) => {
  const { page, rowsPerPage } = req.query;
  const { idCompany } = req.user;
  const { data, count } = await articleService.getDiscounts(idCompany, page, rowsPerPage);
  res.status(StatusCodes.OK).json({ data, count });
};

module.exports = {
  getDiscounts,
};
