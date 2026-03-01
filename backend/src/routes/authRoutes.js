/**
 * Authentication Routes
 */

const express = require('express');
const authController = require('../controllers/authController');
const { protect, refreshAccessToken } = require('../middleware/auth');
const { validate, validations } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', validations.register, validate, authController.register);
router.post('/login', validations.login, validate, authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.get('/verify-email/:token', authController.verifyEmail);
router.get('/check-email', authController.checkEmail);
router.post('/refresh-token', refreshAccessToken);

// Protected routes
router.use(protect);
router.get('/me', authController.getMe);
router.patch('/update-password', validations.changePassword, validate, authController.updatePassword);

module.exports = router;
