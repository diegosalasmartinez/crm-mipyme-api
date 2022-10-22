const { StatusCodes } = require('http-status-codes');
const DealService = require('../services/DealService');
const dealService = new DealService();

const getDeals = async (req, res) => {
  const { idCompany } = req.user;
  const data = await dealService.getDeals(idCompany);
  res.status(StatusCodes.OK).json(data);
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
  const { deal, step } = req.body;
  await dealService.updateStep(deal, step)
  res.status(StatusCodes.OK).json({ message: 'La oportunidad se ha actualizado' });
};

module.exports = {
  getDeals,
  getDealDetail,
  getDealBasicInfo,
  updateDealStep,
};
