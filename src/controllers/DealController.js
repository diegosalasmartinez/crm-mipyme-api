const { StatusCodes } = require('http-status-codes');
const DealService = require('../services/DealService');
const dealService = new DealService();
const LeadService = require('../services/LeadService');
const leadService = new LeadService();

const getDeals = async (req, res) => {
  const { idCompany } = req.user;
  const data = await dealService.getDeals(idCompany);
  res.status(StatusCodes.OK).json(data);
};

const createDeal = async (req, res) => {
  const { id: idUser } = req.user;
  const { idCampaign, lead, deal } = req.body;
  const leadStored = await leadService.getLeadByIdSimple(lead.id);
  const contact = await leadStored.getContact();
  await dealService.addDealThroughCampaign(idUser, contact.id, deal, idCampaign);
  res.status(StatusCodes.OK).json({ message: `Oportunidad ${deal.name} registrada correctamente` });
};

const getDealDetail = async (req, res) => {
  const { idDeal } = req.params;
  const deal = await dealService.getDealById(idDeal);
  res.status(StatusCodes.OK).json(deal);
};

const getDealBasicInfo = async (req, res) => {
  const { idDeal } = req.params;
  const deal = await dealService.getDealByIdSimple(idDeal);
  res.status(StatusCodes.OK).json(deal);
};

const updateDealStep = async (req, res) => {
  const { deal, step, data } = req.body;
  await dealService.updateStep(deal, step, data);
  res.status(StatusCodes.OK).json({ message: 'La oportunidad se ha actualizado' });
};

const dashboard = async (req, res) => {
  const { idCompany } = req.user;
  const stats = await dealService.dashboard(idCompany);
  res.status(StatusCodes.OK).json(stats);
};

module.exports = {
  getDeals,
  createDeal,
  getDealDetail,
  getDealBasicInfo,
  updateDealStep,
  dashboard
};
