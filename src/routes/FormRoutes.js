const express = require('express');
const { getForms, getFormDetail, addForm } = require('../controllers/FormController');

const router = express.Router();

router.get('/', getForms);
router.get('/:idForm', getFormDetail);
router.post('/', addForm);

module.exports = router;
