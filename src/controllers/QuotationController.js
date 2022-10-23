const { StatusCodes } = require('http-status-codes');
const QuotationService = require('../services/QuotationService');
const quotationService = new QuotationService();

const getQuotations = async (req, res) => {
  const { status } = req.query;
  const { idCompany } = req.user;
  const obj = await quotationService.getQuotations(idCompany, status);
  res.status(StatusCodes.OK).json({ data: obj.data, count: obj.count });
};

const getQuotationById = async (req, res) => {
  const { idQuotation } = req.params;
  const quotation = await quotationService.getQuotationById(idQuotation);
  res.status(StatusCodes.OK).json(quotation);
};

const addQuotation = async (req, res) => {
  const { idCompany } = req.user;
  const quotation = req.body;
  const quotationCreated = await quotationService.addQuotation(idCompany, quotation);
  res.status(StatusCodes.OK).json(quotationCreated);
};

const updateQuotation = async (req, res) => {
  const { idCompany } = req.user;
  const quotation = req.body;
  await quotationService.updateQuotation(idCompany, quotation);
  res.status(StatusCodes.OK).json({ message: 'La cotizacion ha sido actualizada' });
};

const approveQuotation = async (req, res) => {
  const quotation = req.body;
  await quotationService.approveQuotation(quotation);
  res.status(StatusCodes.OK).json({ message: 'La cotizacion ha sido aprobada' });
};

module.exports = {
  getQuotations,
  getQuotationById,
  addQuotation,
  updateQuotation,
  approveQuotation
};
