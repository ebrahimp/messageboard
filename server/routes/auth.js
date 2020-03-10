const express = require('express');
const { login, logout } = require('../controllers/authController');
const { getUserById } = require('../controllers/userController');

const router = express.Router();

router.post('/login', login);
router.get('/logout', logout);

router.param('userId', getUserById);

module.exports = router;
