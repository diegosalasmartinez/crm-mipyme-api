const { StatusCodes } = require('http-status-codes');
const CampaignService = require('../services/CampaignService');
const campaignService = new CampaignService();
const ListService = require('../services/ListService');
const listService = new ListService();

const getCampaignsByCompany = async (req, res) => {
  const { status } = req.query;
  const { id: idUser, idCompany, roles } = req.user;
  const isAdmin = roles.filter((r) => r.key === 'admin' || r.key === 'admin_marketing').length > 0;

  let obj = {
    data: [],
    count: 0,
  };
  if (isAdmin) {
    obj = await campaignService.getCampaigns(idCompany, status);
  } else if (status === 'bulk') {
    obj = await campaignService.getCampaignsByUser(idUser, idCompany, status);
  } else if (status === 'approved') {
    obj = await campaignService.getAssignedCampaignsByUser(idUser, idCompany, status);
  }
  res.status(StatusCodes.OK).json({ data: obj.data, count: obj.count });
};

const getCampaignById = async (req, res) => {
  const { idCampaign } = req.params;
  const campaign = await campaignService.getCampaignById(idCampaign);
  const lists = await listService.getListsByArrayId(campaign.lists);
  const stats = await campaignService.getCampaignStats(campaign);
  res.status(StatusCodes.OK).json({ campaign, lists, stats });
};

const addCampaign = async (req, res) => {
  const { id: idUser, idCompany } = req.user;
  const { idProgram, campaign } = req.body;
  await campaignService.addCampaign(idUser, idCompany, idProgram, campaign);
  res
    .status(StatusCodes.OK)
    .json({ message: `El borrador de la campaña ${campaign.name} ha sido registrado` });
};

const updateCampaign = async (req, res) => {
  const { idCompany } = req.user;
  const campaign = req.body;
  await campaignService.updateCampaign(idCompany, campaign);
  res.status(StatusCodes.OK).json({
    message: `La campaña ${campaign.name} ha sido actualizada correctamente`,
  });
};

const approveCampaign = async (req, res) => {
  const { id: idUser, idCompany } = req.user;
  const campaign = req.body;
  await campaignService.approveCampaign(idUser, idCompany, campaign);
  res.status(StatusCodes.OK).json({
    message: `La campaña ${campaign.name} ha sido aprobada`,
  });
};

const runCampaigns = async (req, res) => {
  await campaignService.runCampaigns();
  res.status(StatusCodes.OK).json({ message: `Done` });
};

const sendCampaigns = async (req, res) => {
  const result = await campaignService.sendCampaigns();
  res.status(StatusCodes.OK).json(result);
};

module.exports = {
  getCampaignsByCompany,
  getCampaignById,
  addCampaign,
  updateCampaign,
  approveCampaign,
  runCampaigns,
  sendCampaigns,
};
