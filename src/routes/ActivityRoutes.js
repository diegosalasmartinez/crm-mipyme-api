const express = require('express');
const { addActivity } = require('../controllers/ActivityController');

const router = express.Router();

router.post('/', addActivity);

module.exports = router;
