const express = require('express');
const {
  getTickets,
  getTicketDetail,
  addTicket,
  updateTicketStatus,
  dashboard,
  performanceUsers,
  reassignTicket
} = require('../controllers/TicketController');

const router = express.Router();

router.get('/', getTickets);
router.get('/performance', performanceUsers);
router.get('/dashboard', dashboard);
router.get('/:idTicket', getTicketDetail);
router.post('/', addTicket);
router.post('/update/status', updateTicketStatus);
router.post('/reassign', reassignTicket);

module.exports = router;
