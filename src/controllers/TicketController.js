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
  await ticketService.addTicket(idUser, ticket);
  res.status(StatusCodes.OK).json({ message: `La solicitud ${ticket.name} ha sido registrada` });
};

const updateTicketStatus = async (req, res) => {
  const { ticket, status } = req.body;
  await ticketService.updateStatus(ticket.id, status);
  res.status(StatusCodes.OK).json({ message: 'La solicitud se ha actualizada' });
};

const dashboard = async (req, res) => {
  const { idCompany } = req.user;
  const stats = await ticketService.dashboard(idCompany);
  res.status(StatusCodes.OK).json(stats);
};

module.exports = {
  getTickets,
  getTicketDetail,
  addTicket,
  updateTicketStatus,
  dashboard,
};
