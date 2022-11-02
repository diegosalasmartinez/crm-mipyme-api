const { StatusCodes } = require('http-status-codes');
const LeadService = require('../services/LeadService');
const leadService = new LeadService();

const getLeads = async (req, res) => {
  const { page, rowsPerPage } = req.query;
  const { idCompany } = req.user;
  const { data, count } = await leadService.getLeads(idCompany, page, rowsPerPage);
  res.status(StatusCodes.OK).json({ data, count });
};

const getLeadById = async (req, res) => {
  const { idLead } = req.params;
  const lead = await leadService.getLeadById(idLead);
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

const seed_addLeads = async (req, res) => {
  const { id } = req.user;
  const { number } = req.query;
  await leadService.seed_addLeads(id, number);
  res.status(StatusCodes.OK).json({ message: 'Done' });
};

module.exports = {
  getLeads,
  getLeadById,
  addLead,
  addLeadBulk,
  seed_addLeads,
};
