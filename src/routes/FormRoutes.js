const express = require('express');
const {
  getForms,
  getFormDetail,
  addForm,
  getFormSimple,
} = require('../controllers/FormController');

const router = express.Router();

router.get('/', getForms);
router.get('/:idForm', getFormDetail);
router.get('/simple/:idForm', getFormSimple);
router.post('/', addForm);

module.exports = router;
