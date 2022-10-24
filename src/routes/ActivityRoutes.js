const express = require('express');
const {
  getActivities,
  getActivity,
  addActivity,
  updateActivity,
} = require('../controllers/ActivityController');

const router = express.Router();

router.get('/', getActivities);
router.get('/:idActivity', getActivity);
router.post('/', addActivity);
router.patch('/', updateActivity);

module.exports = router;
