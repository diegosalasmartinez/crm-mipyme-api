const express = require('express');
const { getAccount } = require('../controllers/AccountController');

const router = express.Router();

router.get('/', getAccount);

module.exports = router;
