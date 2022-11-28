const { StatusCodes } = require('http-status-codes');
const LeadService = require('../services/LeadService');
const leadService = new LeadService();
const CampaignService = require('../services/CampaignService');
const campaignService = new CampaignService();
const QuotationService = require('../services/QuotationService');
const quotationService = new QuotationService();
const ProductService = require('../services/ProductService');
const productService = new ProductService();

const getLeads = async (req, res) => {
  const { page, rowsPerPage, name, email, classification: classificationKey } = req.query;
  const { idCompany } = req.user;
  const { data, count } = await leadService.getLeads(
    idCompany,
    page,
    rowsPerPage,
    name,
    email,
    classificationKey
  );
  res.status(StatusCodes.OK).json({ data, count });
};

const getLeadSimple = async (req, res) => {
  const { idLead } = req.params;
  const lead = await leadService.getLeadByIdSimple(idLead);
  res.status(StatusCodes.OK).json(lead);
};

const getLeadById = async (req, res) => {
  const { idLead } = req.params;
  const leadStored = await leadService.getLeadById(idLead);
  const campaigns = await campaignService.getCampaignsByLead(leadStored.id);
  const quotations = await quotationService.getQuotationsByLead(leadStored.id);
  const quotationsAccepted = await quotationService.getQuotationsAcceptedByLead(leadStored.id);
  const products = await productService.getProductsByQuotations(quotationsAccepted);
  const lead = leadStored.toJSON();
  lead.campaigns = campaigns;
  lead.quotations = quotations;
  lead.products = products;
  res.status(StatusCodes.OK).json(lead);
};

const addLeadBulk = async (req, res) => {
  const { id } = req.user;
  const leads = req.body;
  for (const lead of leads) {
    await leadService.addLead(id, lead);
  }
  res.status(StatusCodes.OK).json({ message: 'Done' });
};

const addLead = async (req, res) => {
  const { id } = req.user;
  const lead = req.body;
  await leadService.addLead(id, lead);
  res.status(StatusCodes.OK).json({ message: `El cliente ${lead.name} ha sido registrado` });
};

const updateLead = async (req, res) => {
  const lead = req.body;
  await leadService.updateLead(lead);
  res.status(StatusCodes.OK).json({ message: `El cliente ${lead.name} ha sido actualizado` });
};

const validateLead = async (req, res) => {
  const { idLead, emailValidated } = req.query;
  await leadService.validateLead(idLead, emailValidated);
  res.status(StatusCodes.OK).json({ message: `El cliente ha sido actualizado` });
};

const seed_addLeads = async (req, res) => {
  const { id } = req.user;
  const { number } = req.query;
  await leadService.seed_addLeads(id, number);
  res.status(StatusCodes.OK).json({ message: 'Done' });
};

const seed_addLeadsByForm = async (req, res) => {
  const { idForm, number } = req.query;
  await leadService.seed_addLeadsByForm(idForm, number);
  res.status(StatusCodes.OK).json({ message: 'Done' });
};

module.exports = {
  getLeads,
  getLeadById,
  getLeadSimple,
  addLead,
  validateLead,
  updateLead,
  addLeadBulk,
  seed_addLeads,
  seed_addLeadsByForm,
};
