const express = require('express');
const { getContacts, convertLead } = require('../controllers/ContactController');

const router = express.Router();

router.get('/', getContacts);
router.post('/convert', convertLead);

module.exports = router;
