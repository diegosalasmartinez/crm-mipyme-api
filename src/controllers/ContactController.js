const { StatusCodes } = require('http-status-codes');
const ContactService = require('../services/ContactService');
const contactService = new ContactService();

const getContacts = async (req, res) => {
  const { page, rowsPerPage } = req.query;
  const { id: idUser, idCompany, roles } = req.user;
  const isAdmin = roles.filter((r) => r.key === 'admin' || r.key === 'admin_marketing').length > 0;

  let obj = {
    data: [],
    count: 0,
  };

  if (isAdmin) {
    obj = await contactService.getContacts(idCompany, page, rowsPerPage);
  } else {
    obj = await contactService.getContactsByPortfolio(idUser, idCompany, page, rowsPerPage);
  }
  res.status(StatusCodes.OK).json({ data: obj.data, count: obj.count });
};

const convertLead = async (req, res) => {
  const { id: idUser } = req.user;
  const { idCampaign, lead, assignedTo, registerDeal, deal } = req.body;
  if (idCampaign) {
    await contactService.convertLeadThroughCampaign(idUser, lead.id, assignedTo, idCampaign, registerDeal, deal);
  }
  res.status(StatusCodes.OK).json({
    message: `El cliente potencial ${lead.name} ${lead.lastName} ha sido convertido a contacto`,
  });
};

module.exports = {
  getContacts,
  convertLead,
};
