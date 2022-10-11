const express = require('express');
const {
  getPlan,
  addPlan,
} = require('../controllers/PlanController');

const router = express.Router();

router.get('/', getPlan);
router.post('/', addPlan);

module.exports = router;
