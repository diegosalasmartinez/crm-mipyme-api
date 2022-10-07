const { StatusCodes } = require('http-status-codes');
const LeadService = require('../services/LeadService');

const getLeads = async (req, res) => {
  const { page = 0, rowsPerPage = 10 } = req.query;
  const { companyId } = req.user;
  const leadService = new LeadService();
  const { leads, count } = await leadService.getLeads(companyId, page, rowsPerPage);
  res.status(StatusCodes.OK).json({ data: leads, count });
};

const addLead = async (req, res) => {
  const { id, companyId } = req.user;
  const lead = req.body;
  const leadService = new LeadService();
  const leadCreated = await leadService.addLead(companyId, id, lead);
  res.status(StatusCodes.OK).json(leadCreated); 
};

module.exports = {
  getLeads,
  addLead  
};
