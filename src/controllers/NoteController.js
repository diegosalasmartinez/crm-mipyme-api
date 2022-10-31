const { StatusCodes } = require('http-status-codes');
const NoteService = require('../services/NoteService');
const rejectionService = new NoteService();

const addNote = async (req, res) => {
  const { id: idUser } = req.user;
  const { idDeal, idActivity, idTicket, body } = req.body;
  await rejectionService.addNote(idUser, idDeal, idTicket, idActivity, body);
  res.status(StatusCodes.OK).json({ message: 'Se ha agregado el comentario' });
};

module.exports = {
  addNote,
};
