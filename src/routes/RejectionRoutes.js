const express = require('express');
const { addRejection } = require('../controllers/RejectionController');

const router = express.Router();

router.post('/', addRejection);

module.exports = router;
