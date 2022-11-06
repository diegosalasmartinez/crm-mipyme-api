const { StatusCodes } = require('http-status-codes');
const CampaignService = require('../services/CampaignService');
const campaignService = new CampaignService();

const verifyRead = async (req, res) => {
  const { idLead, idCampaign } = req.params;
  console.log(idLead, idCampaign)
  // await campaignService.increaseScopeCampaign(idCampaign, idLead);
  // res.status(StatusCodes.OK).sendBlankGif();
  res.sendFile('../assets/mipyme.svg')
};

module.exports = {
  verifyRead,
};
