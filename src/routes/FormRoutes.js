const express = require('express');
const {
  getForms,
  getFormDetail,
  addForm,
  updateForm,
  getFormSimple,
  seed_addLeadsByForm 
} = require('../controllers/FormController');

const router = express.Router();

router.get('/', getForms);
router.get('/:idForm', getFormDetail);
router.get('/simple/:idForm', getFormSimple);
router.post('/', addForm);
router.patch('/', updateForm);
// Commands
router.post('/job', seed_addLeadsByForm);

module.exports = router;
