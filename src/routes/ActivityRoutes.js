const express = require('express');
const { getActivities, addActivity } = require('../controllers/ActivityController');

const router = express.Router();

router.get('/', getActivities);
router.post('/', addActivity);

module.exports = router;
