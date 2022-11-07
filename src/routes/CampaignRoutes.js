const express = require('express');
const {
  getCampaignsByCompany,
  getCampaignById,
  addCampaign,
  sendCampaign,
  updateCampaign,
  approveCampaign,
  generateKPICampaign,
  addSpending,
  excludeLeadOfCampaign,
  runCampaigns,
  sendCampaigns,
} = require('../controllers/CampaignController');

const router = express.Router();

router.get('/', getCampaignsByCompany);
router.get('/exclude', excludeLeadOfCampaign);
router.get('/send/:idCampaign', sendCampaign);
router.get('/kpi/:idCampaign', generateKPICampaign);
router.get('/:idCampaign', getCampaignById);
router.post('/', addCampaign);
router.patch('/', updateCampaign);
router.post('/approve', approveCampaign);
router.post('/spending', addSpending);
router.get('/job/run', runCampaigns);
router.get('/job/send', sendCampaigns);

module.exports = router;
