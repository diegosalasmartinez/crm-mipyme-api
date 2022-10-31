const { StatusCodes } = require('http-status-codes');
const TicketService = require('../services/TicketService');
const ticketService = new TicketService();

const getTickets = async (req, res) => {
  const { idCompany } = req.user;
  const { data, count } = await ticketService.getTickets(idCompany);
  res.status(StatusCodes.OK).json({ data, count });
};

const getTicketDetail = async (req, res) => {
  const { idTicket } = req.params;
  const ticket = await ticketService.getTicketById(idTicket);
  res.status(StatusCodes.OK).json(ticket);
};

const addTicket = async (req, res) => {
  const { id: idUser } = req.user;
  const ticket = req.body;
  const ticketCreated = await ticketService.addTicket(idUser, ticket);
  res.status(StatusCodes.OK).json(ticketCreated);
};

const updateTicketStatus = async (req, res) => {
  const { ticket, status } = req.body;
  await ticketService.updateStatus(ticket, status);
  res.status(StatusCodes.OK).json({ message: 'La solicitud se ha actualizado' });
};

module.exports = {
  getTickets,
  getTicketDetail,
  addTicket,
  updateTicketStatus,
};
