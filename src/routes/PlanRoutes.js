const express = require('express');
const { getPlan, addPlan, dashboard } = require('../controllers/PlanController');

const router = express.Router();

router.get('/', getPlan);
router.post('/', addPlan);
router.get('/dashboard', dashboard);

module.exports = router;
