const express = require('express');
const { verifyRead } = require('../controllers/WatchController');

const router = express.Router();

router.get('/mail/verify/:idCampaign/:idLead', verifyRead);

module.exports = router;
