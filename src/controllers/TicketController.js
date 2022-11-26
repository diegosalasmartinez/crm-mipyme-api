const { StatusCodes } = require('http-status-codes');
const TicketService = require('../services/TicketService');
const ticketService = new TicketService();

const getTickets = async (req, res) => {
  const { page, rowsPerPage, finished } = req.query;
  const { idCompany } = req.user;
  const { data, count } = await ticketService.getTickets(idCompany, page, rowsPerPage, finished);
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
  res.status(StatusCodes.OK).json({ message: 'La solicitud ha sido actualizada' });
};

const reassignTicket = async (req, res) => {
  const { id, user, userName } = req.body;
  await ticketService.reassignTicket(id, user);
  res
    .status(StatusCodes.OK)
    .json({ message: `La solicitud ha sido asignada al usuario ${userName}` });
};

const dashboard = async (req, res) => {
  const { idCompany } = req.user;
  const stats = await ticketService.dashboard(idCompany);
  res.status(StatusCodes.OK).json(stats);
};

const performanceUsers = async (req, res) => {
  const { idCompany } = req.user;
  const users = await ticketService.performanceUsers(idCompany);
  res.status(StatusCodes.OK).json(users);
};

module.exports = {
  getTickets,
  getTicketDetail,
  addTicket,
  updateTicketStatus,
  dashboard,
  performanceUsers,
  reassignTicket,
};
