/**
 * Screening Routes
 */

const express = require('express');
const screeningController = require('../controllers/screeningController');
const { protect, restrictTo } = require('../middleware/auth');
const { validate, validations } = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(protect);

// User routes
router.get('/tests', screeningController.getAvailableTests);
router.get('/progress/:testType', screeningController.getProgress);

router.route('/')
  .get(screeningController.getScreeningHistory)
  .post(validations.submitScreening, validate, screeningController.submitScreening);

router.route('/:id')
  .get(validations.mongoId, validate, screeningController.getScreeningResult);

router.post('/:id/follow-up', validations.mongoId, validate, screeningController.recordFollowUp);

// Counselor/Admin routes
router.get('/attention', restrictTo('counselor', 'admin'), screeningController.getResultsNeedingAttention);
router.get('/analytics', restrictTo('admin'), screeningController.getAnalytics);

module.exports = router;
