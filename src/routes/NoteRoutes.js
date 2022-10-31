const express = require('express');
const { addNote } = require('../controllers/NoteController');

const router = express.Router();

router.post('/', addNote);

module.exports = router;
