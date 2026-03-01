/**
 * Screening Controller
 * Handles mental health screening tests and results
 */

const ScreeningResult = require('../models/ScreeningResult');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

// Test configurations
const testConfigs = {
  phq9: {
    name: 'PHQ-9 Depression Screening',
    maxScore: 27,
    interpretation: [
      { min: 0, max: 4, level: 'minimal', label: 'Minimal depression', color: '#10b981' },
      { min: 5, max: 9, level: 'mild', label: 'Mild depression', color: '#f59e0b' },
      { min: 10, max: 14, level: 'moderate', label: 'Moderate depression', color: '#f97316' },
      { min: 15, max: 19, level: 'moderately_severe', label: 'Moderately severe depression', color: '#ef4444' },
      { min: 20, max: 27, level: 'severe', label: 'Severe depression', color: '#dc2626' },
    ],
    criticalQuestion: 8, // Question about self-harm
  },
  gad7: {
    name: 'GAD-7 Anxiety Screening',
    maxScore: 21,
    interpretation: [
      { min: 0, max: 4, level: 'minimal', label: 'Minimal anxiety', color: '#10b981' },
      { min: 5, max: 9, level: 'mild', label: 'Mild anxiety', color: '#f59e0b' },
      { min: 10, max: 14, level: 'moderate', label: 'Moderate anxiety', color: '#f97316' },
      { min: 15, max: 21, level: 'severe', label: 'Severe anxiety', color: '#ef4444' },
    ],
  },
  stress: {
    name: 'Student Stress Assessment',
    maxScore: 40,
    interpretation: [
      { min: 0, max: 10, level: 'low', label: 'Low stress', color: '#10b981' },
      { min: 11, max: 20, level: 'moderate', label: 'Moderate stress', color: '#f59e0b' },
      { min: 21, max: 30, level: 'high', label: 'High stress', color: '#f97316' },
      { min: 31, max: 40, level: 'severe', label: 'Severe stress', color: '#ef4444' },
    ],
  },
};

/**
 * Get interpretation based on score
 */
const getInterpretation = (testType, score) => {
  const config = testConfigs[testType];
  if (!config) return null;

  for (const range of config.interpretation) {
    if (score >= range.min && score <= range.max) {
      return {
        level: range.level,
        label: range.label,
        color: range.color,
      };
    }
  }
  return config.interpretation[config.interpretation.length - 1];
};

/**
 * Generate recommendations based on severity
 */
const generateRecommendations = (severity, testType) => {
  const recommendations = [];

  // Base recommendations for all
  recommendations.push({
    type: 'resource',
    title: 'Self-help resources',
    description: 'Explore our library of mental health resources and exercises.',
    priority: 'medium',
  });

  if (severity.level === 'minimal' || severity.level === 'low') {
    recommendations.push({
      type: 'action',
      title: 'Continue self-care',
      description: 'Your results look positive! Keep up with your current wellness practices.',
      priority: 'low',
    });
  } else if (severity.level === 'mild' || severity.level === 'moderate') {
    recommendations.push({
      type: 'action',
      title: 'Consider support',
      description: 'You might benefit from additional support. Consider reaching out to a counselor.',
      priority: 'medium',
    });
    recommendations.push({
      type: 'appointment',
      title: 'Schedule a session',
      description: 'A brief consultation can help you develop coping strategies.',
      priority: 'medium',
    });
  } else {
    recommendations.push({
      type: 'appointment',
      title: 'Speak with a professional',
      description: 'We strongly recommend scheduling an appointment with a counselor.',
      priority: 'high',
    });
    recommendations.push({
      type: 'follow_up',
      title: 'Retake assessment',
      description: 'Please retake this assessment in 2 weeks to track your progress.',
      priority: 'high',
    });
  }

  // Add crisis resources for severe cases
  if (severity.level === 'severe' || severity.level === 'moderately_severe') {
    recommendations.unshift({
      type: 'crisis',
      title: 'Crisis support available',
      description: 'If you\'re in crisis, please reach out to our 24/7 crisis helpline.',
      priority: 'urgent',
    });
  }

  return recommendations;
};

/**
 * Submit screening test results
 * POST /api/v1/screening
 */
exports.submitScreening = async (req, res, next) => {
  try {
    const {
      testType,
      answers,
      startedAt,
      deviceType,
    } = req.body;

    const config = testConfigs[testType];
    if (!config) {
      return next(new AppError('Invalid test type.', 400));
    }

    // Calculate total score
    const totalScore = answers.reduce((sum, a) => sum + a.answer, 0);
    const severity = getInterpretation(testType, totalScore);

    // Check for critical flags (e.g., self-harm questions)
    const criticalFlags = [];
    if (config.criticalQuestion !== undefined) {
      const criticalAnswer = answers.find(a => a.questionIndex === config.criticalQuestion);
      if (criticalAnswer && criticalAnswer.answer >= 2) {
        criticalFlags.push({
          questionIndex: criticalAnswer.questionIndex,
          questionText: criticalAnswer.questionText,
          answer: criticalAnswer.answer,
          flag: 'self_harm_risk',
        });
      }
    }

    // Generate recommendations
    const recommendations = generateRecommendations(severity, testType);

    // Calculate completion time
    const completionTime = startedAt
      ? Math.round((Date.now() - new Date(startedAt).getTime()) / 1000)
      : null;

    // Create screening result
    const result = await ScreeningResult.create({
      user: req.user._id,
      testType,
      testName: config.name,
      answers,
      totalScore,
      maxScore: config.maxScore,
      severity,
      criticalFlags,
      recommendations,
      completionTime,
      startedAt,
      deviceType,
    });

    // Log concerning results
    if (result.requiresAttention) {
      logger.warn(`Concerning screening result: User ${req.user._id}, Test ${testType}, Score ${totalScore}/${config.maxScore}`);
    }

    res.status(201).json({
      status: 'success',
      data: {
        result: {
          id: result._id,
          testType: result.testType,
          testName: result.testName,
          totalScore: result.totalScore,
          maxScore: result.maxScore,
          percentageScore: result.percentageScore,
          severity: result.severity,
          recommendations: result.recommendations,
          completedAt: result.completedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's screening history
 * GET /api/v1/screening
 */
exports.getScreeningHistory = async (req, res, next) => {
  try {
    const { testType, page = 1, limit = 20 } = req.query;

    const query = { user: req.user._id };
    if (testType) query.testType = testType;

    const total = await ScreeningResult.countDocuments(query);
    const results = await ScreeningResult.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-answers -userAgent');

    res.status(200).json({
      status: 'success',
      results: results.length,
      data: {
        results,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single screening result
 * GET /api/v1/screening/:id
 */
exports.getScreeningResult = async (req, res, next) => {
  try {
    const result = await ScreeningResult.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!result) {
      return next(new AppError('No screening result found.', 404));
    }

    // Mark as viewed
    if (!result.resultsViewed) {
      result.resultsViewed = true;
      result.viewedAt = new Date();
      await result.save();
    }

    res.status(200).json({
      status: 'success',
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get progress over time for a test type
 * GET /api/v1/screening/progress/:testType
 */
exports.getProgress = async (req, res, next) => {
  try {
    const { testType } = req.params;
    const progress = await ScreeningResult.getUserProgress(req.user._id, testType);

    res.status(200).json({
      status: 'success',
      data: {
        testType,
        progress,
        totalAssessments: progress.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get available tests
 * GET /api/v1/screening/tests
 */
exports.getAvailableTests = async (req, res, next) => {
  const tests = Object.entries(testConfigs).map(([key, config]) => ({
    id: key,
    name: config.name,
    maxScore: config.maxScore,
    questionCount: key === 'phq9' ? 9 : key === 'gad7' ? 7 : 10,
    estimatedTime: key === 'phq9' ? '3-5 minutes' : key === 'gad7' ? '2-4 minutes' : '4-6 minutes',
  }));

  res.status(200).json({
    status: 'success',
    data: {
      tests,
    },
  });
};

/**
 * Record follow-up action
 * POST /api/v1/screening/:id/follow-up
 */
exports.recordFollowUp = async (req, res, next) => {
  try {
    const { action } = req.body;

    const result = await ScreeningResult.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        followUpAction: {
          taken: true,
          action,
          actionDate: new Date(),
        },
      },
      { new: true }
    );

    if (!result) {
      return next(new AppError('No screening result found.', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        followUpAction: result.followUpAction,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get results needing attention (Counselor/Admin)
 * GET /api/v1/screening/attention
 */
exports.getResultsNeedingAttention = async (req, res, next) => {
  try {
    const results = await ScreeningResult.getRequiringAttention();

    res.status(200).json({
      status: 'success',
      results: results.length,
      data: {
        results,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get anonymous analytics (Admin)
 * GET /api/v1/screening/analytics
 */
exports.getAnalytics = async (req, res, next) => {
  try {
    const { testType, days = 30 } = req.query;

    const analytics = {};
    const testTypes = testType ? [testType] : Object.keys(testConfigs);

    for (const type of testTypes) {
      analytics[type] = await ScreeningResult.getAnonymousStats(type, parseInt(days));
    }

    res.status(200).json({
      status: 'success',
      data: {
        analytics,
        period: `${days} days`,
      },
    });
  } catch (error) {
    next(error);
  }
};
