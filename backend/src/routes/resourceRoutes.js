/**
 * Resource Routes
 */

const express = require('express');
const resourceController = require('../controllers/resourceController');
const { protect, restrictTo, optionalAuth } = require('../middleware/auth');
const { validate, validations } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/categories', resourceController.getCategories);
router.get('/featured', resourceController.getFeaturedResources);
router.get('/', optionalAuth, resourceController.getResources);
router.get('/:idOrSlug', optionalAuth, resourceController.getResource);
router.get('/:id/related', validations.mongoId, validate, resourceController.getRelatedResources);

// Protected routes
router.use(protect);

router.get('/user/saved', resourceController.getSavedResources);
router.post('/:id/rate', validations.mongoId, validate, resourceController.rateResource);
router.post('/:id/save', validations.mongoId, validate, resourceController.saveResource);
router.post('/:id/complete', validations.mongoId, validate, resourceController.markComplete);

// Admin routes
router.use(restrictTo('admin'));

router.post('/', resourceController.createResource);
router.get('/admin/all', resourceController.getAllResourcesAdmin);
router.patch('/:id', validations.mongoId, validate, resourceController.updateResource);
router.delete('/:id', validations.mongoId, validate, resourceController.deleteResource);

module.exports = router;
