const express = require('express');
const {
  getCampaignsByCompany,
  getCampaignById,
  addCampaign,
  updateCampaign,
  approveCampaign,
  runCampaigns,
  sendCampaigns
} = require('../controllers/CampaignController');

const router = express.Router();

router.get('/', getCampaignsByCompany);
router.get('/:idCampaign', getCampaignById);
router.post('/', addCampaign);
router.patch('/', updateCampaign);
router.post('/approve', approveCampaign);
router.get('/job/run', runCampaigns);
router.get('/job/send', sendCampaigns);

module.exports = router;
