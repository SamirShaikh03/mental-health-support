/**
 * User Routes
 */

const express = require('express');
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/auth');
const { validate, validations } = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(protect);

// User profile routes
router.get('/profile', userController.getProfile);
router.patch('/profile', validations.updateProfile, validate, userController.updateProfile);
router.patch('/preferences', userController.updatePreferences);
router.delete('/deactivate', userController.deactivateAccount);
router.post('/streak', userController.updateStreak);

// Get counselors (for appointment booking)
router.get('/counselors', userController.getCounselors);

// Admin routes
router.get('/', restrictTo('admin'), userController.getAllUsers);
router.get('/:id', restrictTo('admin', 'counselor'), validations.mongoId, validate, userController.getUser);
router.patch('/:id/role', restrictTo('admin'), validations.mongoId, validate, userController.updateUserRole);

module.exports = router;
