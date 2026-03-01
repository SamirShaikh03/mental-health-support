/**
 * Journal Routes
 */

const express = require('express');
const journalController = require('../controllers/journalController');
const { protect } = require('../middleware/auth');
const { validate, validations } = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Static routes first
router.get('/stats', journalController.getJournalStats);
router.get('/tags', journalController.getUserTags);
router.get('/prompts', journalController.getPrompts);

// CRUD routes
router.route('/')
  .get(journalController.getJournalEntries)
  .post(validations.createJournalEntry, validate, journalController.createJournalEntry);

router.route('/:id')
  .get(validations.mongoId, validate, journalController.getJournalEntry)
  .patch(validations.mongoId, validate, journalController.updateJournalEntry)
  .delete(validations.mongoId, validate, journalController.deleteJournalEntry);

router.patch('/:id/favorite', validations.mongoId, validate, journalController.toggleFavorite);
router.patch('/:id/archive', validations.mongoId, validate, journalController.archiveEntry);

module.exports = router;
