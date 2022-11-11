const express = require('express');
const { addLeadByForm, getFormSimple } = require('../controllers/ExternalController');

const router = express.Router();

router.get('/form/:idForm', getFormSimple);
router.post('/lead/form', addLeadByForm);

module.exports = router;
