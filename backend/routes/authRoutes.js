const express = require('express');
const router = express.Router();
const { signup, login, verifyOtp } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);

module.exports = router;
