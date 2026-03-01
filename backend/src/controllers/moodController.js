/**
 * Mood Controller
 * Handles mood tracking and analytics
 */

const MoodEntry = require('../models/MoodEntry');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * Create mood entry
 * POST /api/v1/mood
 */
exports.createMoodEntry = async (req, res, next) => {
  try {
    const {
      moodScore,
      anxietyLevel,
      energyLevel,
      sleepQuality,
      sleepHours,
      emotions,
      activities,
      factors,
      notes,
      weather,
      hasHarmThoughts,
    } = req.body;

    const moodEntry = await MoodEntry.create({
      user: req.user._id,
      moodScore,
      anxietyLevel,
      energyLevel,
      sleepQuality,
      sleepHours,
      emotions,
      activities,
      factors,
      notes,
      weather,
      hasHarmThoughts,
    });

    // If concerning, log for review
    if (moodEntry.isConcerning) {
      logger.warn(`Concerning mood entry from user ${req.user._id}: score ${moodScore}`);
    }

    res.status(201).json({
      status: 'success',
      data: {
        moodEntry,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's mood entries
 * GET /api/v1/mood
 */
exports.getMoodEntries = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 30,
      startDate,
      endDate,
      sort = '-createdAt',
    } = req.query;

    const query = { user: req.user._id };

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const total = await MoodEntry.countDocuments(query);
    const entries = await MoodEntry.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      results: entries.length,
      data: {
        entries,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single mood entry
 * GET /api/v1/mood/:id
 */
exports.getMoodEntry = async (req, res, next) => {
  try {
    const entry = await MoodEntry.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!entry) {
      return next(new AppError('No mood entry found with that ID.', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        entry,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update mood entry
 * PATCH /api/v1/mood/:id
 */
exports.updateMoodEntry = async (req, res, next) => {
  try {
    const entry = await MoodEntry.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!entry) {
      return next(new AppError('No mood entry found with that ID.', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        entry,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete mood entry
 * DELETE /api/v1/mood/:id
 */
exports.deleteMoodEntry = async (req, res, next) => {
  try {
    const entry = await MoodEntry.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!entry) {
      return next(new AppError('No mood entry found with that ID.', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get mood statistics
 * GET /api/v1/mood/stats
 */
exports.getMoodStats = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const stats = await MoodEntry.getUserStats(req.user._id, parseInt(days));

    res.status(200).json({
      status: 'success',
      data: {
        stats,
        period: `${days} days`,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get mood trends
 * GET /api/v1/mood/trends
 */
exports.getMoodTrends = async (req, res, next) => {
  try {
    const { days = 7 } = req.query;
    const trends = await MoodEntry.getMoodTrends(req.user._id, parseInt(days));

    res.status(200).json({
      status: 'success',
      data: {
        trends,
        period: `${days} days`,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get today's mood
 * GET /api/v1/mood/today
 */
exports.getTodaysMood = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const entry = await MoodEntry.findOne({
      user: req.user._id,
      date: { $gte: today },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: {
        entry: entry || null,
        hasEntryToday: !!entry,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get concerning entries (Counselor/Admin)
 * GET /api/v1/mood/concerning
 */
exports.getConcerningEntries = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const query = { isConcerning: true };
    
    const total = await MoodEntry.countDocuments(query);
    const entries = await MoodEntry.find(query)
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      results: entries.length,
      data: {
        entries,
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
