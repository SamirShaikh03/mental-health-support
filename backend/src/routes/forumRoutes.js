/**
 * Forum Routes - Peer Support
 */

const express = require('express');
const forumController = require('../controllers/forumController');
const { protect, restrictTo, optionalAuth } = require('../middleware/auth');
const { validate, validations } = require('../middleware/validation');

const router = express.Router();

// Public routes (with optional auth for personalization)
router.get('/categories', forumController.getCategories);
router.get('/', optionalAuth, forumController.getPosts);
router.get('/:id', optionalAuth, validations.mongoId, validate, forumController.getPost);

// Protected routes
router.use(protect);

router.post('/', validations.createPost, validate, forumController.createPost);
router.get('/user/my-posts', forumController.getMyPosts);

router.patch('/:id', validations.mongoId, validate, forumController.updatePost);
router.delete('/:id', validations.mongoId, validate, forumController.deletePost);

router.post('/:id/like', validations.mongoId, validate, forumController.toggleLike);
router.post('/:id/reply', validations.mongoId, validations.createReply, validate, forumController.addReply);
router.post('/:id/report', validations.mongoId, validations.reportPost, validate, forumController.reportPost);

router.post('/:postId/reply/:replyId/like', forumController.toggleReplyLike);

// Admin/Counselor routes
router.get('/admin/reported', restrictTo('counselor', 'admin'), forumController.getReportedPosts);
router.post('/:id/moderate', restrictTo('counselor', 'admin'), validations.mongoId, validate, forumController.moderatePost);
router.post('/:id/pin', restrictTo('counselor', 'admin'), validations.mongoId, validate, forumController.togglePin);

module.exports = router;
