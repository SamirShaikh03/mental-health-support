/**
 * Request Validation Middleware
 * Validates incoming requests using express-validator
 */

const { validationResult, body, param, query } = require('express-validator');
const AppError = require('../utils/AppError');

/**
 * Handle validation errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    return next(new AppError(errorMessages.join('. '), 400));
  }
  next();
};

/**
 * Common validation chains
 */
const validations = {
  // Authentication validations
  register: [
    body('firstName')
      .trim()
      .notEmpty().withMessage('First name is required')
      .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters'),
    body('lastName')
      .trim()
      .notEmpty().withMessage('Last name is required')
      .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('confirmPassword')
      .notEmpty().withMessage('Please confirm your password')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }
        return true;
      }),
    body('age')
      .optional()
      .isInt({ min: 13, max: 120 }).withMessage('Age must be between 13 and 120'),
    body('agreedToTerms')
      .isBoolean().withMessage('You must agree to terms')
      .custom((value) => {
        if (!value) throw new Error('You must agree to the terms and conditions');
        return true;
      }),
  ],

  login: [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required'),
    body('role')
      .optional()
      .isIn(['student', 'counselor', 'admin']).withMessage('Invalid role'),
  ],

  // User profile validations
  updateProfile: [
    body('firstName')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 }).withMessage('First name must be 1-50 characters'),
    body('lastName')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 }).withMessage('Last name must be 1-50 characters'),
    body('age')
      .optional()
      .isInt({ min: 13, max: 120 }).withMessage('Age must be between 13 and 120'),
    body('bio')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
    body('location')
      .optional()
      .trim()
      .isLength({ max: 200 }).withMessage('Location cannot exceed 200 characters'),
  ],

  changePassword: [
    body('currentPassword')
      .notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .notEmpty().withMessage('New password is required')
      .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('confirmNewPassword')
      .notEmpty().withMessage('Please confirm your new password')
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('Passwords do not match');
        }
        return true;
      }),
  ],

  // Mood entry validations
  createMoodEntry: [
    body('moodScore')
      .notEmpty().withMessage('Mood score is required')
      .isInt({ min: 1, max: 10 }).withMessage('Mood score must be between 1 and 10'),
    body('anxietyLevel')
      .optional()
      .isInt({ min: 1, max: 10 }).withMessage('Anxiety level must be between 1 and 10'),
    body('energyLevel')
      .optional()
      .isInt({ min: 1, max: 10 }).withMessage('Energy level must be between 1 and 10'),
    body('sleepHours')
      .optional()
      .isFloat({ min: 0, max: 24 }).withMessage('Sleep hours must be between 0 and 24'),
    body('emotions')
      .optional()
      .isArray().withMessage('Emotions must be an array'),
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters'),
  ],

  // Journal entry validations
  createJournalEntry: [
    body('content')
      .notEmpty().withMessage('Journal content is required')
      .isLength({ max: 10000 }).withMessage('Content cannot exceed 10000 characters'),
    body('title')
      .optional()
      .trim()
      .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
    body('type')
      .optional()
      .isIn(['free_write', 'gratitude', 'reflection', 'goals', 'mood', 'prompt', 'daily'])
      .withMessage('Invalid journal type'),
    body('tags')
      .optional()
      .isArray().withMessage('Tags must be an array'),
  ],

  // Appointment validations
  createAppointment: [
    body('title')
      .notEmpty().withMessage('Appointment title is required')
      .trim()
      .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
    body('date')
      .notEmpty().withMessage('Appointment date is required')
      .isISO8601().withMessage('Invalid date format'),
    body('startTime')
      .notEmpty().withMessage('Start time is required')
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format (HH:MM)'),
    body('type')
      .notEmpty().withMessage('Appointment type is required')
      .isIn(['in-person', 'video', 'phone', 'chat']).withMessage('Invalid appointment type'),
    body('duration')
      .optional()
      .isInt({ min: 15, max: 180 }).withMessage('Duration must be between 15 and 180 minutes'),
  ],

  // Screening result validations
  submitScreening: [
    body('testType')
      .notEmpty().withMessage('Test type is required')
      .isIn(['phq9', 'gad7', 'stress', 'ghq12', 'dass21', 'custom'])
      .withMessage('Invalid test type'),
    body('answers')
      .notEmpty().withMessage('Answers are required')
      .isArray({ min: 1 }).withMessage('At least one answer is required'),
    body('answers.*.questionIndex')
      .isInt({ min: 0 }).withMessage('Invalid question index'),
    body('answers.*.answer')
      .isInt({ min: 0 }).withMessage('Invalid answer value'),
  ],

  // Forum post validations
  createForumPost: [
    body('title')
      .notEmpty().withMessage('Post title is required')
      .trim()
      .isLength({ min: 5, max: 200 }).withMessage('Title must be 5-200 characters'),
    body('content')
      .notEmpty().withMessage('Post content is required')
      .isLength({ min: 10, max: 5000 }).withMessage('Content must be 10-5000 characters'),
    body('category')
      .notEmpty().withMessage('Category is required')
      .isIn(['general', 'anxiety', 'depression', 'stress', 'relationships', 'academics', 'career', 'family', 'grief', 'self_esteem', 'sleep', 'eating', 'substance', 'other'])
      .withMessage('Invalid category'),
    body('tags')
      .optional()
      .isArray({ max: 5 }).withMessage('Maximum 5 tags allowed'),
  ],

  createReply: [
    body('content')
      .notEmpty().withMessage('Reply content is required')
      .isLength({ min: 2, max: 2000 }).withMessage('Reply must be 2-2000 characters'),
    body('isAnonymous')
      .optional()
      .isBoolean().withMessage('isAnonymous must be a boolean'),
  ],

  // Forum posts (alias for createForumPost)
  createPost: [
    body('title')
      .notEmpty().withMessage('Post title is required')
      .trim()
      .isLength({ min: 5, max: 200 }).withMessage('Title must be 5-200 characters'),
    body('content')
      .notEmpty().withMessage('Post content is required')
      .isLength({ min: 10, max: 5000 }).withMessage('Content must be 10-5000 characters'),
    body('category')
      .notEmpty().withMessage('Category is required')
      .isString().withMessage('Category must be a string'),
    body('isAnonymous')
      .optional()
      .isBoolean().withMessage('isAnonymous must be a boolean'),
    body('tags')
      .optional()
      .isArray({ max: 5 }).withMessage('Maximum 5 tags allowed'),
  ],

  reportPost: [
    body('reason')
      .notEmpty().withMessage('Report reason is required')
      .isIn(['spam', 'harassment', 'inappropriate', 'misinformation', 'other'])
      .withMessage('Invalid report reason'),
    body('description')
      .optional()
      .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  ],

  // Chat validations
  chat: [
    body('message')
      .notEmpty().withMessage('Message is required')
      .isLength({ max: 5000 }).withMessage('Message cannot exceed 5000 characters'),
    body('sessionId')
      .optional()
      .isMongoId().withMessage('Invalid session ID'),
  ],

  // Pagination validations
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  ],

  // ID parameter validation
  mongoId: [
    param('id')
      .isMongoId().withMessage('Invalid ID format'),
  ],
};

module.exports = {
  validate,
  validations,
  body,
  param,
  query,
};
