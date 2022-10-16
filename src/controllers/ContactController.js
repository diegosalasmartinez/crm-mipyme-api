const { StatusCodes } = require('http-status-codes');
const ContactService = require('../services/ContactService');
const contactService = new ContactService();

const convertLead = async (req, res) => {
  const { lead, registerDeal, deal } = req.body
  await contactService.convertLead(lead, registerDeal, deal)
  res.status(StatusCodes.OK).json({
    message: `El cliente potencial ${lead.name} ${lead.lastName} ha sido convertido a`,
  });
};


const convertLeadThroughCampaign = async (req, res) => {
  const { id: idUser } = req.user
  const { idCampaign, lead, registerDeal, deal } = req.body
  await contactService.convertLeadThroughCampaign(idUser, lead.id, idCampaign, registerDeal, deal)
  res.status(StatusCodes.OK).json({
    message: `El cliente potencial ${lead.name} ${lead.lastName} ha sido convertido a contacto`,
  });
};

module.exports = {
  convertLead,
  convertLeadThroughCampaign
};
