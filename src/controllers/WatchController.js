const { StatusCodes } = require('http-status-codes');
const CampaignService = require('../services/CampaignService');
const campaignService = new CampaignService();

const verifyRead = async (req, res) => {
  const { idLead, idCampaign } = req.params;
  console.log(`Lead id: ${idLead}`);
  await campaignService.addScopeCampaign(idCampaign);
  res.status(StatusCodes.OK).sendBlankGif();
};

module.exports = {
  verifyRead,
};
