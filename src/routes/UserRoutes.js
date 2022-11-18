const express = require('express');
const {
  getUsers,
  getUserById,
  getProfile,
  addUser,
  updateCompany,
} = require('../controllers/UserController');

const router = express.Router();

router.get('/', getUsers);
router.get('/profile', getProfile);
router.patch('/company', updateCompany);
router.get('/:idUser', getUserById);
router.post('/', addUser);

module.exports = router;
