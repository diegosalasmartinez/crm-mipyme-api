const express = require('express');
const {
  getPlan,
  addPlan,
  addProgram
} = require('../controllers/PlanController');

const router = express.Router();

router.get('/', getPlan);
router.post('/', addPlan);
router.post('/program', addProgram);

module.exports = router;
