const express = require('express');
const {
  getCampaignsByCompany,
  getCampaignById,
  addCampaign,
  updateCampaign,
  approveCampaign
} = require('../controllers/CampaignController');

const router = express.Router();

router.get('/', getCampaignsByCompany);
router.get('/:idCampaign', getCampaignById);
router.post('/', addCampaign);
router.patch('/', updateCampaign);
router.post('/approve', approveCampaign);

module.exports = router;
