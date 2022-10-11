const express = require('express');
const {
  getCampaignsByCompany,
  addCampaign
} = require('../controllers/CampaignController');

const router = express.Router();

router.get('/', getCampaignsByCompany);
router.post('/', addCampaign);

module.exports = router;
