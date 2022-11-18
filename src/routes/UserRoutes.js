const express = require('express');
const { getUsers, getUserById, getProfile, addUser } = require('../controllers/UserController');

const router = express.Router();

router.get('/', getUsers);
router.get('/profile', getProfile);
router.get('/:idUser', getUserById);
router.post('/', addUser);

module.exports = router;
