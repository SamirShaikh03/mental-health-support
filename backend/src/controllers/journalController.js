/**
 * Journal Controller
 * Handles journal entries and reflections
 */

const JournalEntry = require('../models/JournalEntry');
const AppError = require('../utils/AppError');

/**
 * Create journal entry
 * POST /api/v1/journal
 */
exports.createJournalEntry = async (req, res, next) => {
  try {
    const {
      title,
      content,
      type,
      prompt,
      mood,
      tags,
      gratitudeItems,
      goals,
      entryDate,
    } = req.body;

    const entry = await JournalEntry.create({
      user: req.user._id,
      title,
      content,
      type,
      prompt,
      mood,
      tags,
      gratitudeItems,
      goals,
      entryDate: entryDate || new Date(),
    });

    res.status(201).json({
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
 * Get user's journal entries
 * GET /api/v1/journal
 */
exports.getJournalEntries = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      tag,
      search,
      startDate,
      endDate,
      isFavorite,
      isArchived = 'false',
      sort = '-entryDate',
    } = req.query;

    const query = { user: req.user._id, isArchived: isArchived === 'true' };

    if (type) query.type = type;
    if (tag) query.tags = tag;
    if (isFavorite !== undefined) query.isFavorite = isFavorite === 'true';
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }
    if (startDate || endDate) {
      query.entryDate = {};
      if (startDate) query.entryDate.$gte = new Date(startDate);
      if (endDate) query.entryDate.$lte = new Date(endDate);
    }

    const total = await JournalEntry.countDocuments(query);
    const entries = await JournalEntry.find(query)
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
 * Get single journal entry
 * GET /api/v1/journal/:id
 */
exports.getJournalEntry = async (req, res, next) => {
  try {
    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!entry) {
      return next(new AppError('No journal entry found with that ID.', 404));
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
 * Update journal entry
 * PATCH /api/v1/journal/:id
 */
exports.updateJournalEntry = async (req, res, next) => {
  try {
    const entry = await JournalEntry.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!entry) {
      return next(new AppError('No journal entry found with that ID.', 404));
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
 * Delete journal entry
 * DELETE /api/v1/journal/:id
 */
exports.deleteJournalEntry = async (req, res, next) => {
  try {
    const entry = await JournalEntry.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!entry) {
      return next(new AppError('No journal entry found with that ID.', 404));
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
 * Toggle favorite status
 * PATCH /api/v1/journal/:id/favorite
 */
exports.toggleFavorite = async (req, res, next) => {
  try {
    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!entry) {
      return next(new AppError('No journal entry found with that ID.', 404));
    }

    entry.isFavorite = !entry.isFavorite;
    await entry.save();

    res.status(200).json({
      status: 'success',
      data: {
        isFavorite: entry.isFavorite,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Archive journal entry
 * PATCH /api/v1/journal/:id/archive
 */
exports.archiveEntry = async (req, res, next) => {
  try {
    const entry = await JournalEntry.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isArchived: true },
      { new: true }
    );

    if (!entry) {
      return next(new AppError('No journal entry found with that ID.', 404));
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
 * Get journal statistics
 * GET /api/v1/journal/stats
 */
exports.getJournalStats = async (req, res, next) => {
  try {
    const stats = await JournalEntry.getUserStats(req.user._id);
    const streak = await JournalEntry.getStreak(req.user._id);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
        streak,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all tags used by user
 * GET /api/v1/journal/tags
 */
exports.getUserTags = async (req, res, next) => {
  try {
    const tags = await JournalEntry.aggregate([
      { $match: { user: req.user._id } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 50 },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        tags: tags.map(t => ({ tag: t._id, count: t.count })),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get journal prompts
 * GET /api/v1/journal/prompts
 */
exports.getPrompts = async (req, res, next) => {
  const prompts = {
    gratitude: [
      "What are three things you're grateful for today?",
      "Who made a positive impact on your day and how?",
      "What small moment brought you joy recently?",
      "What ability or skill are you thankful to have?",
      "What challenge taught you something valuable?",
    ],
    reflection: [
      "What emotion dominated your day and why?",
      "What would you do differently if you could redo today?",
      "What are you most proud of accomplishing recently?",
      "How did you show kindness to yourself today?",
      "What pattern do you notice in your recent thoughts?",
    ],
    goals: [
      "What is one small step you can take toward your goal tomorrow?",
      "What obstacle is holding you back and how can you overcome it?",
      "How will achieving your goal make you feel?",
      "Who can support you in reaching your goals?",
      "What habit do you want to build this week?",
    ],
    mood: [
      "On a scale of 1-10, how would you rate your mood today and why?",
      "What triggered any negative emotions today?",
      "What activity boosted your mood the most?",
      "How did your body feel today?",
      "What do you need right now to feel better?",
    ],
    daily: [
      "What was the highlight of your day?",
      "What challenged you today?",
      "What did you learn today?",
      "How did you take care of yourself today?",
      "What are you looking forward to tomorrow?",
    ],
  };

  const { type } = req.query;
  
  res.status(200).json({
    status: 'success',
    data: {
      prompts: type ? prompts[type] || [] : prompts,
    },
  });
};
