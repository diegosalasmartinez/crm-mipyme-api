const { StatusCodes } = require('http-status-codes');
const CompanyService = require('../services/CompanyService');
const companyService = new CompanyService();
const QuotationService = require('../services/QuotationService');
const quotationService = new QuotationService();
const PdfService = require('../services/PdfService');
const pdfService = new PdfService();

const getQuotations = async (req, res) => {
  const { id: idUser, idCompany, roles } = req.user;
  const { status } = req.query;
  const obj = await quotationService.getQuotations(idUser, idCompany, roles, status);
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
  await quotationService.addQuotation(idCompany, quotation);
  res.status(StatusCodes.OK).json({ message: 'La cotizacion ha sido registrada' });
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

const generatePDF = async (req, res) => {
  const { idQuotation } = req.params;
  const { idCompany } = req.user;
  const quotation = await quotationService.getQuotationById(idQuotation);
  const company = await companyService.getCompanyById(idCompany);
  const stream = res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename=quotation.pdf',
  });

  pdfService.generateQuotationPDF(
    quotation,
    quotation.deal.contact,
    company,
    (chunk) => stream.write(chunk),
    () => stream.end()
  );
};

const sendPDF = async (req, res) => {
  const { idQuotation } = req.params;
  const { idCompany } = req.user;
  const quotation = await quotationService.getQuotationById(idQuotation);
  const company = await companyService.getCompanyById(idCompany);
  pdfService.sendQuotationPDF(quotation, quotation.deal.contact, company);
  res.status(StatusCodes.OK).json({ message: 'El PDF de la cotización ha sido enviado.' });
};

module.exports = {
  getQuotations,
  getQuotationById,
  addQuotation,
  updateQuotation,
  approveQuotation,
  generatePDF,
  sendPDF,
};
