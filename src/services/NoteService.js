const { Note } = require('../models/index');
const { BadRequestError } = require('../errors');

class NoteService {
  async addNote(idUser, idDeal, idTicket, idActivity, body) {
    try {
      const note = await Note.create({
        idDeal,
        idTicket,
        idActivity,
        body,
        createdBy: idUser,
      });
      return note;
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}

module.exports = NoteService;
