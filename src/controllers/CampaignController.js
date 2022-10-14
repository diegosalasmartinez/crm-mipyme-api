const { StatusCodes } = require('http-status-codes');
const CampaignService = require('../services/CampaignService');
const campaignService = new CampaignService();

const getCampaignsByCompany = async (req, res) => {
  const { status } = req.query;
  const { id: idUser, idCompany, roles } = req.user;
  const allRecords = roles.filter(r => (r.key === 'admin' || r.key === 'admin_marketing')).length > 0
  const { data, count } = await campaignService.getCampaignsByCompany(
    idUser,
    idCompany,
    status,
    allRecords
  );
  res.status(StatusCodes.OK).json({ data, count });
};

const getCampaignById = async (req, res) => {
  const { idCampaign } = req.params;
  const campaign = await campaignService.getCampaignById(idCampaign);
  res.status(StatusCodes.OK).json(campaign);
};

const addCampaign = async (req, res) => {
  const { id: idUser, idCompany } = req.user;
  const { idProgram, campaign } = req.body;

  const campaignCreated = await campaignService.addCampaign(
    idUser,
    idCompany,
    idProgram,
    campaign
  );
  res.status(StatusCodes.OK).json(campaignCreated);
};

const updateCampaign = async (req, res) => {
  const { idCompany } = req.user;
  const campaign = req.body;
  await campaignService.updateCampaign(idCompany, campaign);
  res.status(StatusCodes.OK).json({
    message: `La campaña ${campaign.name} ha sido actualizada correctamente`,
  });
};

module.exports = {
  getCampaignsByCompany,
  getCampaignById,
  addCampaign,
  updateCampaign,
};
