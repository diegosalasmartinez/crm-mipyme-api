const { StatusCodes } = require('http-status-codes');
const RejectionService = require('../services/RejectionService');
const rejectionService = new RejectionService();

const addRejection = async (req, res) => {
  const { id: idUser } = req.user;
  const { idQuotation, idTicket, idCampaign, reason } = req.body;
  await rejectionService.addRejection(idUser, idQuotation, idTicket, idCampaign, reason);
  res.status(StatusCodes.OK).json({ message: 'El motivo de rechazo ha sido registrado' });
};

module.exports = {
  addRejection,
};
