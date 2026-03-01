/**
 * Resource Controller
 * Handles mental health resources and content
 */

const Resource = require('../models/Resource');
const AppError = require('../utils/AppError');

/**
 * Get all resources
 * GET /api/v1/resources
 */
exports.getResources = async (req, res, next) => {
  try {
    const {
      type,
      category,
      language = 'en',
      search,
      sortBy = 'popular',
      page = 1,
      limit = 20,
      featured,
    } = req.query;

    const query = {
      isPublished: true,
      language: { $in: [language, 'all'] },
    };

    if (type) query.type = type;
    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;

    if (search) {
      query.$text = { $search: search };
    }

    let sortOptions = {};
    switch (sortBy) {
      case 'newest':
        sortOptions = { publishedAt: -1 };
        break;
      case 'rating':
        sortOptions = { 'rating.average': -1 };
        break;
      case 'views':
        sortOptions = { 'stats.views': -1 };
        break;
      default:
        sortOptions = { isFeatured: -1, 'rating.average': -1, 'stats.views': -1 };
    }

    const total = await Resource.countDocuments(query);
    const resources = await Resource.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-content')
      .lean();

    res.status(200).json({
      status: 'success',
      results: resources.length,
      data: {
        resources,
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
 * Get single resource
 * GET /api/v1/resources/:idOrSlug
 */
exports.getResource = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;

    let resource;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      resource = await Resource.findById(idOrSlug);
    } else {
      resource = await Resource.findOne({ slug: idOrSlug });
    }

    if (!resource || !resource.isPublished) {
      return next(new AppError('Resource not found.', 404));
    }

    // Increment view count
    resource.stats.views += 1;
    await resource.save();

    res.status(200).json({
      status: 'success',
      data: {
        resource,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get resource categories
 * GET /api/v1/resources/categories
 */
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Resource.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const allCategories = [
      { id: 'stress_management', name: 'Stress Management', icon: '🧘' },
      { id: 'anxiety', name: 'Anxiety & Worry', icon: '💭' },
      { id: 'depression', name: 'Depression', icon: '🌧️' },
      { id: 'mindfulness', name: 'Mindfulness & Meditation', icon: '🧠' },
      { id: 'sleep', name: 'Sleep & Rest', icon: '😴' },
      { id: 'relationships', name: 'Relationships', icon: '💕' },
      { id: 'academic', name: 'Academic Wellness', icon: '📚' },
      { id: 'self_esteem', name: 'Self-Esteem', icon: '⭐' },
      { id: 'crisis', name: 'Crisis Support', icon: '🆘' },
      { id: 'general', name: 'General Wellness', icon: '❤️' },
    ];

    const categoriesWithCount = allCategories.map(cat => {
      const found = categories.find(c => c._id === cat.id);
      return { ...cat, resourceCount: found ? found.count : 0 };
    });

    res.status(200).json({
      status: 'success',
      data: {
        categories: categoriesWithCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get featured resources
 * GET /api/v1/resources/featured
 */
exports.getFeaturedResources = async (req, res, next) => {
  try {
    const resources = await Resource.find({
      isPublished: true,
      isFeatured: true,
    })
      .sort({ publishedAt: -1 })
      .limit(10)
      .select('-content');

    res.status(200).json({
      status: 'success',
      results: resources.length,
      data: {
        resources,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Rate resource
 * POST /api/v1/resources/:id/rate
 */
exports.rateResource = async (req, res, next) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return next(new AppError('Rating must be between 1 and 5.', 400));
    }

    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return next(new AppError('Resource not found.', 404));
    }

    // Check if user already rated
    const existingRating = resource.rating.userRatings.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (existingRating) {
      existingRating.rating = rating;
    } else {
      resource.rating.userRatings.push({
        user: req.user._id,
        rating,
      });
    }

    // Recalculate average
    const totalRatings = resource.rating.userRatings.length;
    const sumRatings = resource.rating.userRatings.reduce((sum, r) => sum + r.rating, 0);
    resource.rating.average = sumRatings / totalRatings;
    resource.rating.count = totalRatings;

    await resource.save();

    res.status(200).json({
      status: 'success',
      data: {
        rating: resource.rating.average,
        totalRatings: resource.rating.count,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Save resource to favorites
 * POST /api/v1/resources/:id/save
 */
exports.saveResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return next(new AppError('Resource not found.', 404));
    }

    const savedIndex = resource.stats.savedBy.indexOf(req.user._id);
    let isSaved;

    if (savedIndex > -1) {
      resource.stats.savedBy.splice(savedIndex, 1);
      resource.stats.saves -= 1;
      isSaved = false;
    } else {
      resource.stats.savedBy.push(req.user._id);
      resource.stats.saves += 1;
      isSaved = true;
    }

    await resource.save();

    res.status(200).json({
      status: 'success',
      data: {
        isSaved,
        saveCount: resource.stats.saves,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get saved resources
 * GET /api/v1/resources/saved
 */
exports.getSavedResources = async (req, res, next) => {
  try {
    const resources = await Resource.find({
      'stats.savedBy': req.user._id,
      isPublished: true,
    })
      .sort({ publishedAt: -1 })
      .select('-content');

    res.status(200).json({
      status: 'success',
      results: resources.length,
      data: {
        resources,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Track resource completion
 * POST /api/v1/resources/:id/complete
 */
exports.markComplete = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return next(new AppError('Resource not found.', 404));
    }

    if (!resource.stats.completedBy) {
      resource.stats.completedBy = [];
    }

    if (!resource.stats.completedBy.includes(req.user._id)) {
      resource.stats.completedBy.push(req.user._id);
      resource.stats.completions = (resource.stats.completions || 0) + 1;
      await resource.save();
    }

    res.status(200).json({
      status: 'success',
      message: 'Resource marked as complete.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get related resources
 * GET /api/v1/resources/:id/related
 */
exports.getRelatedResources = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return next(new AppError('Resource not found.', 404));
    }

    const related = await Resource.find({
      _id: { $ne: resource._id },
      isPublished: true,
      $or: [
        { category: resource.category },
        { tags: { $in: resource.tags } },
      ],
    })
      .sort({ 'rating.average': -1 })
      .limit(5)
      .select('-content');

    res.status(200).json({
      status: 'success',
      results: related.length,
      data: {
        resources: related,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============ Admin Routes ============

/**
 * Create resource (Admin)
 * POST /api/v1/resources
 */
exports.createResource = async (req, res, next) => {
  try {
    const resource = await Resource.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json({
      status: 'success',
      data: {
        resource,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update resource (Admin)
 * PATCH /api/v1/resources/:id
 */
exports.updateResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!resource) {
      return next(new AppError('Resource not found.', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        resource,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete resource (Admin)
 * DELETE /api/v1/resources/:id
 */
exports.deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);

    if (!resource) {
      return next(new AppError('Resource not found.', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Resource deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all resources including unpublished (Admin)
 * GET /api/v1/resources/admin/all
 */
exports.getAllResourcesAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const total = await Resource.countDocuments();
    const resources = await Resource.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-content');

    res.status(200).json({
      status: 'success',
      results: resources.length,
      data: {
        resources,
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
