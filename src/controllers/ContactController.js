const { StatusCodes } = require('http-status-codes');
const ContactService = require('../services/ContactService');
const contactService = new ContactService();

const getContacts = async (req, res) => {
  const { page, rowsPerPage } = req.query;
  const { id: idUser, idCompany, roles } = req.user;
  const { data, count } = await contactService.getContacts(
    idUser,
    idCompany,
    roles,
    page,
    rowsPerPage
  );
  res.status(StatusCodes.OK).json({ data, count });
};

const convertLead = async (req, res) => {
  const { id: idUser } = req.user;
  const { idCampaign, lead, assignedTo, registerDeal, deal } = req.body;
  await contactService.convertLead(idUser, lead.id, assignedTo, idCampaign, registerDeal, deal);
  res.status(StatusCodes.OK).json({
    message: `El cliente potencial ${lead.name} ${lead.lastName} ha sido convertido a contacto`,
  });
};

const reassignContact = async (req, res) => {
  const { contact, idUser } = req.body;
  await contactService.reassignContact(contact.id, idUser);
  res.status(StatusCodes.OK).json({
    message: `El cliente potencial ${contact.lead.name} ${contact.lead.lastName} ha sido reasignado`,
  });
};

module.exports = {
  getContacts,
  convertLead,
  reassignContact,
};
