const { StatusCodes } = require('http-status-codes');
const CampaignService = require('../services/CampaignService');
const campaignService = new CampaignService();

const getCampaignsByCompany = async (req, res) => {
  const { idCompany } = req.user;
  const { data, count } = await campaignService.getCampaignsByCompany(
    idCompany
  );
  res.status(StatusCodes.OK).json({ data, count });
};

const addCampaign = async (req, res) => {
  const { id: idUser } = req.user;
  const { idProgram, campaign } = req.body;

  const campaignCreated = await campaignService.addCampaign(
    idUser,
    idProgram,
    campaign
  );
  res.status(StatusCodes.OK).json(campaignCreated);
};

module.exports = {
  getCampaignsByCompany,
  addCampaign,
};
