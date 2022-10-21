const { StatusCodes } = require('http-status-codes');
const QuotationService = require('../services/QuotationService');
const quotationService = new QuotationService();

const addQuotation = async (req, res) => {
  const { idCompany } = req.user;
  const quotation = req.body;
  const quotationCreated = await quotationService.addQuotation(idCompany, quotation)
  res.status(StatusCodes.OK).json(quotationCreated);
};

module.exports = {
  addQuotation
};
