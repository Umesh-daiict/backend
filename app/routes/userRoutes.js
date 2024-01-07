const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/user-controller');
const { verifyToken } = require('../middleware/auth');

router.post('/api/register', userControllers.registerUser);
router.post('/api/login', userControllers.loginUser);

router.get('/api/users', verifyToken('admin'), userControllers.getUsers);

module.exports = router;
