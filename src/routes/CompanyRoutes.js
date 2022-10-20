const express = require('express');
const { getCompanyByAdmin } = require('../controllers/CompanyController');

const router = express.Router();

router.get('/', getCompanyByAdmin);

module.exports = router;
