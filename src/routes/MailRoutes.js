const express = require('express');
const { verifyRead } = require('../controllers/MailController');

const router = express.Router();

router.get('/verify/:idCampaign/:idLead', verifyRead);

module.exports = router;
