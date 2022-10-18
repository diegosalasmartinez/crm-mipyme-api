const { StatusCodes } = require('http-status-codes');
const TicketService = require('../services/TicketService');
const ticketService = new TicketService();

const getTickets = async (req, res) => {
  const { id: idUser, idCompany } = req.user;
  const data = await ticketService.getTickets(idCompany);
  res.status(StatusCodes.OK).json(data);
};

const getTicketDetail = async (req, res) => {
  const { idTicket } = req.params;
  const ticket = await ticketService.getTicketById(idTicket);
  res.status(StatusCodes.OK).json(ticket);
};

const addTicket = async (req, res) => {
  const { id: idUser } = req.user;
  const ticket = req.body
  const ticketCreated = await ticketService.addTicket(idUser, ticket);
  res.status(StatusCodes.OK).json(ticketCreated);
};


module.exports = {
  getTickets,
  getTicketDetail,
  addTicket
};
