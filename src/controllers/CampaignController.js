const { StatusCodes } = require('http-status-codes');
const CampaignService = require('../services/CampaignService');
const campaignService = new CampaignService();

const getCampaignsByCompany = async (req, res) => {
  const { idCompany } = req.user;
  const campaign = await campaignService.getCampaignsByCompany(idCompany);
  res.status(StatusCodes.OK).json(campaign);
};

const addCampaign = async (req, res) => {
  const { idProgram, campaign } = req.body;
  console.log(idProgram)
  console.log(campaign)

  const campaignCreated = await campaignService.addCampaign(
    idProgram,
    campaign
  );
  res.status(StatusCodes.OK).json(campaignCreated);
};

module.exports = {
  getCampaignsByCompany,
  addCampaign,
};
