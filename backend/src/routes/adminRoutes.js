/**
 * Admin Routes
 */

const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/auth');
const { validate, validations } = require('../middleware/validation');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(restrictTo('admin'));

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// Analytics
router.get('/analytics/mood', adminController.getMoodAnalytics);
router.get('/analytics/screening', adminController.getScreeningAnalytics);
router.get('/analytics/appointments', adminController.getAppointmentAnalytics);
router.get('/analytics/engagement', adminController.getEngagementAnalytics);

// Alerts and concerns
router.get('/alerts', adminController.getAlerts);

// User management (for following up on alerts)
router.get('/user/:userId/summary', validations.mongoId, validate, adminController.getUserSummary);

// Data export
router.get('/export', adminController.exportAnalytics);

module.exports = router;
