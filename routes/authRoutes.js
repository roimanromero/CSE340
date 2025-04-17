const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Show login and register forms
router.get('/login', authController.showLogin);
router.get('/register', authController.showRegister);

// Handle login and registration
router.post('/login', authController.loginUser);
router.post('/register', authController.registerUser);

// Logout
router.get('/logout', authController.logoutUser);

module.exports = router;
