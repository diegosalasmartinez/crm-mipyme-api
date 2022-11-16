const express = require('express');
const { getContacts, convertLead, reassignContact } = require('../controllers/ContactController');

const router = express.Router();

router.get('/', getContacts);
router.post('/convert', convertLead);
router.post('/reassign', reassignContact);

module.exports = router;
