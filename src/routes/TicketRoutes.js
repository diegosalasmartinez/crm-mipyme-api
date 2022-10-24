const express = require('express');
const {
  getTickets,
  getTicketDetail,
  addTicket,
  updateTicketStatus,
} = require('../controllers/TicketController');

const router = express.Router();

router.get('/', getTickets);
router.get('/:idTicket', getTicketDetail);
router.post('/', addTicket);
router.post('/update/status', updateTicketStatus);

module.exports = router;
