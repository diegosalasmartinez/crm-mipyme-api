const express = require('express');
const {
  getTickets,
  getTicketDetail,
  addTicket,
} = require('../controllers/TicketController');

const router = express.Router();

router.get('/', getTickets);
router.get('/:idTicket', getTicketDetail);
router.post('/', addTicket);

module.exports = router;
