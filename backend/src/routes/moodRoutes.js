/**
 * Mood Routes
 */

const express = require('express');
const moodController = require('../controllers/moodController');
const { protect, restrictTo } = require('../middleware/auth');
const { validate, validations } = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(protect);

// User routes
router.get('/stats', moodController.getMoodStats);
router.get('/trends', moodController.getMoodTrends);
router.get('/today', moodController.getTodaysMood);

router.route('/')
  .get(moodController.getMoodEntries)
  .post(validations.createMoodEntry, validate, moodController.createMoodEntry);

router.route('/:id')
  .get(validations.mongoId, validate, moodController.getMoodEntry)
  .patch(validations.mongoId, validate, moodController.updateMoodEntry)
  .delete(validations.mongoId, validate, moodController.deleteMoodEntry);

// Counselor/Admin routes
router.get('/concerning', restrictTo('counselor', 'admin'), moodController.getConcerningEntries);

module.exports = router;
