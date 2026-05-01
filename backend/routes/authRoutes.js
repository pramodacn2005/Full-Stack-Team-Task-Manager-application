const express = require('express');
const { signup, login, getMe, getUsers } = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/users', protect, authorize('Admin'), getUsers);

module.exports = router;
