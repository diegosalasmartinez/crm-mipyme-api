const { StatusCodes } = require('http-status-codes');
const LeadService = require('../services/LeadService');
const leadService = new LeadService();

const getLeads = async (req, res) => {
  const { page = 0, rowsPerPage = 10 } = req.query;
  const { idCompany } = req.user;
  const { data, count } = await leadService.getLeads(
    idCompany,
    page,
    rowsPerPage
  );
  res.status(StatusCodes.OK).json({ data, count });
};

const getLeadById = async (req, res) => {
  const { idLead } = req.params;
  const lead = await leadService.getLeadById(idLead);
  res.status(StatusCodes.OK).json(lead);
};

const addLead = async (req, res) => {
  const { id } = req.user;
  const lead = req.body;
  const leadCreated = await leadService.addLead(id, lead);
  res.status(StatusCodes.OK).json(leadCreated);
};

module.exports = {
  getLeads,
  getLeadById,
  addLead,
};
