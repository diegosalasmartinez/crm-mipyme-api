const { StatusCodes } = require('http-status-codes');
const DealService = require('../services/DealService');
const dealService = new DealService();
const LeadService = require('../services/LeadService');
const leadService = new LeadService();
const TicketService = require('../services/TicketService');
const ticketService = new TicketService();
const CampaignService = require('../services/CampaignService');
const campaignService = new CampaignService();

const getDeals = async (req, res) => {
  const { id: idUser, idCompany, roles } = req.user;
  const data = await dealService.getDeals(idUser, idCompany, roles);
  res.status(StatusCodes.OK).json(data);
};

const createDeal = async (req, res) => {
  const { id: idUser } = req.user;
  const { idCampaign, lead, deal } = req.body;
  const leadStored = await leadService.getLeadByIdSimple(lead.id);
  const contact = await leadStored.getContact();
  await dealService.addDeal(idUser, contact.id, deal, idCampaign, null);
  res.status(StatusCodes.OK).json({ message: `Oportunidad ${deal.name} registrada correctamente` });
};

const updateDeal = async (req, res) => {
  const deal = req.body;
  await dealService.updateDeal(deal);
  res.status(StatusCodes.OK).json({ message: `La oportunidad se ha actualizado correctamente` });
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
  await ticketService.updateStatusInBaseOfDeal(deal.id, step);
  if (step === 'won') {
    await campaignService.updateFidelization(deal.id);
  }
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
  updateDeal,
  getDealDetail,
  getDealBasicInfo,
  updateDealStep,
  dashboard,
};
