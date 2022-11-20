const express = require('express');
const { getContacts, convertLead, reassignContact, updateClassification } = require('../controllers/ContactController');

const router = express.Router();

router.get('/', getContacts);
router.post('/convert', convertLead);
router.post('/reassign', reassignContact);
router.patch('/classification', updateClassification);

module.exports = router;
