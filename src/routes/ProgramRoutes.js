const express = require('express');
const { getProgram, addProgram } = require('../controllers/ProgramController');

const router = express.Router();

router.post('/', addProgram);
router.get('/:idProgram', getProgram);

module.exports = router;
