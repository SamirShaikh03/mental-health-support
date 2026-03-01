/**
 * Chat Routes
 */

const express = require('express');
const chatController = require('../controllers/chatController');
const { protect, restrictTo } = require('../middleware/auth');
const { validate, validations } = require('../middleware/validation');

const router = express.Router();

// Public prompts endpoint
router.get('/prompts', chatController.getSuggestedPrompts);

// Protected routes
router.use(protect);

router.post('/', validations.chat, validate, chatController.chat);
router.get('/history', chatController.getChatHistory);

router.get('/:sessionId', validations.mongoId, validate, chatController.getChatSession);
router.post('/:sessionId/end', validations.mongoId, validate, chatController.endChatSession);
router.post('/:sessionId/feedback', validations.mongoId, validate, chatController.submitFeedback);
router.delete('/:sessionId', validations.mongoId, validate, chatController.deleteChatSession);

// Admin/Counselor routes
router.get('/admin/flagged', restrictTo('counselor', 'admin'), chatController.getFlaggedSessions);
router.get('/admin/analytics', restrictTo('admin'), chatController.getChatAnalytics);

module.exports = router;
