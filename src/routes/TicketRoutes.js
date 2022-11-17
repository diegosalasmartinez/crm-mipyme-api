const express = require('express');
const {
  getTickets,
  getTicketDetail,
  addTicket,
  updateTicketStatus,
  dashboard,
  performanceUsers,
} = require('../controllers/TicketController');

const router = express.Router();

router.get('/', getTickets);
router.get('/performance', performanceUsers);
router.get('/dashboard', dashboard);
router.get('/:idTicket', getTicketDetail);
router.post('/', addTicket);
router.post('/update/status', updateTicketStatus);

module.exports = router;
