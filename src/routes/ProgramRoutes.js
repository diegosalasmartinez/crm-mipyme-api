const express = require('express');
const {
  getProgram
} = require('../controllers/ProgramController');

const router = express.Router();

router.get('/:idProgram', getProgram);

module.exports = router;
