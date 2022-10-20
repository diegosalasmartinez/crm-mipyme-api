const express = require('express');
const { getRoles } = require('../controllers/AccountController');

const router = express.Router();

router.get('/roles', getRoles);

module.exports = router;
