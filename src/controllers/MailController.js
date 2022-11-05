const { StatusCodes } = require('http-status-codes');

const verifyRead = async (req, res) => {
  const { idLead, idCampaign } = req.params;
  console.log(idLead, idCampaign);
  res.status(StatusCodes.OK).sendBlankGif();
};

module.exports = {
  verifyRead,
};
