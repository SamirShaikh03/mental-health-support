/**
 * Appointment Routes
 */

const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const { protect, restrictTo } = require('../middleware/auth');
const { validate, validations } = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(protect);

// User routes
router.get('/upcoming', appointmentController.getUpcoming);
router.get('/availability/:counselorId', appointmentController.getCounselorAvailability);

router.route('/')
  .get(appointmentController.getAppointments)
  .post(validations.createAppointment, validate, appointmentController.createAppointment);

router.route('/:id')
  .get(validations.mongoId, validate, appointmentController.getAppointment)
  .patch(validations.mongoId, validate, appointmentController.updateAppointment);

router.patch('/:id/cancel', validations.mongoId, validate, appointmentController.cancelAppointment);
router.patch('/:id/complete', validations.mongoId, validate, appointmentController.completeAppointment);
router.post('/:id/feedback', validations.mongoId, validate, appointmentController.submitFeedback);

// Counselor routes
router.get('/counselor/schedule', restrictTo('counselor', 'admin'), appointmentController.getCounselorAppointments);

module.exports = router;
