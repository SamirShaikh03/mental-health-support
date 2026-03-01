/**
 * Forum Controller
 * Handles peer support forum posts, replies, and interactions
 */

const ForumPost = require('../models/ForumPost');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

// Banned words for content moderation
const bannedPatterns = [
  // Add patterns that should be flagged for moderation
  /\b(harm|hurt|kill)\s*(myself|yourself|themselves)\b/gi,
];

/**
 * Check content for moderation
 */
const checkContentForModeration = (content) => {
  const flags = [];
  for (const pattern of bannedPatterns) {
    if (pattern.test(content)) {
      flags.push('concerning_content');
    }
  }
  return flags;
};

/**
 * Get all forum posts
 * GET /api/v1/forum
 */
exports.getPosts = async (req, res, next) => {
  try {
    const {
      category,
      sortBy = 'recent',
      page = 1,
      limit = 20,
      search,
    } = req.query;

    const query = { status: 'active' };
    if (category) query.category = category;

    if (search) {
      query.$text = { $search: search };
    }

    let sortOptions = {};
    switch (sortBy) {
      case 'popular':
        sortOptions = { 'stats.likeCount': -1 };
        break;
      case 'discussed':
        sortOptions = { 'stats.replyCount': -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      default:
        sortOptions = { isPinned: -1, createdAt: -1 };
    }

    const total = await ForumPost.countDocuments(query);
    const posts = await ForumPost.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-reports')
      .lean();

    // If user is authenticated, add whether they liked each post
    if (req.user) {
      posts.forEach(post => {
        post.isLiked = post.likes.some(id => id.toString() === req.user._id.toString());
        delete post.likes; // Don't expose likes array
      });
    }

    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: {
        posts,
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
 * Get single post with replies
 * GET /api/v1/forum/:id
 */
exports.getPost = async (req, res, next) => {
  try {
    const post = await ForumPost.findOne({
      _id: req.params.id,
      status: 'active',
    });

    if (!post) {
      return next(new AppError('Post not found.', 404));
    }

    // Increment view count
    await post.incrementViews();

    const postObj = post.toObject();

    // Add user interactions if authenticated
    if (req.user) {
      postObj.isLiked = post.likes.includes(req.user._id);
      postObj.isOwner = post.author?.toString() === req.user._id.toString();
      
      // Mark user likes on replies
      postObj.replies = postObj.replies.map(reply => ({
        ...reply,
        isLiked: reply.likes.some(id => id.toString() === req.user._id.toString()),
        isOwner: reply.author?.toString() === req.user._id.toString(),
      }));
    }

    // Remove likes arrays
    delete postObj.likes;
    postObj.replies = postObj.replies.map(reply => {
      delete reply.likes;
      return reply;
    });

    res.status(200).json({
      status: 'success',
      data: {
        post: postObj,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new post
 * POST /api/v1/forum
 */
exports.createPost = async (req, res, next) => {
  try {
    const { title, content, category, isAnonymous, tags } = req.body;

    // Check content for moderation
    const flags = checkContentForModeration(content);
    const needsModeration = flags.length > 0;

    const post = await ForumPost.create({
      author: req.user._id,
      title,
      content,
      category,
      isAnonymous: isAnonymous !== false,
      tags,
      status: needsModeration ? 'pending' : 'active',
      moderationFlags: flags,
      metadata: {
        userAgent: req.headers['user-agent'],
        createdFrom: 'web',
      },
    });

    if (needsModeration) {
      logger.warn(`Forum post flagged for moderation: ${post._id}`);
    }

    res.status(201).json({
      status: 'success',
      data: {
        post: {
          id: post._id,
          title: post.title,
          content: post.content,
          category: post.category,
          isAnonymous: post.isAnonymous,
          authorName: post.authorName,
          status: post.status,
          createdAt: post.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update post
 * PATCH /api/v1/forum/:id
 */
exports.updatePost = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;

    const post = await ForumPost.findOne({
      _id: req.params.id,
      author: req.user._id,
      status: 'active',
    });

    if (!post) {
      return next(new AppError('Post not found or you are not authorized.', 404));
    }

    if (title) post.title = title;
    if (content) {
      post.content = content;
      const flags = checkContentForModeration(content);
      if (flags.length > 0) {
        post.moderationFlags = flags;
        post.status = 'pending';
      }
    }
    if (tags) post.tags = tags;
    post.isEdited = true;
    post.lastEditedAt = new Date();

    await post.save();

    res.status(200).json({
      status: 'success',
      data: {
        post: {
          id: post._id,
          title: post.title,
          content: post.content,
          isEdited: post.isEdited,
          lastEditedAt: post.lastEditedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete post (soft delete)
 * DELETE /api/v1/forum/:id
 */
exports.deletePost = async (req, res, next) => {
  try {
    const query = { _id: req.params.id };

    // Admins can delete any post, users can only delete their own
    if (req.user.role !== 'admin') {
      query.author = req.user._id;
    }

    const post = await ForumPost.findOne(query);

    if (!post) {
      return next(new AppError('Post not found or you are not authorized.', 404));
    }

    post.status = 'deleted';
    await post.save();

    res.status(200).json({
      status: 'success',
      message: 'Post deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Like/unlike post
 * POST /api/v1/forum/:id/like
 */
exports.toggleLike = async (req, res, next) => {
  try {
    const post = await ForumPost.findOne({
      _id: req.params.id,
      status: 'active',
    });

    if (!post) {
      return next(new AppError('Post not found.', 404));
    }

    const isLiked = await post.toggleLike(req.user._id);

    res.status(200).json({
      status: 'success',
      data: {
        isLiked,
        likeCount: post.stats.likeCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add reply to post
 * POST /api/v1/forum/:id/reply
 */
exports.addReply = async (req, res, next) => {
  try {
    const { content, isAnonymous } = req.body;

    const post = await ForumPost.findOne({
      _id: req.params.id,
      status: 'active',
    });

    if (!post) {
      return next(new AppError('Post not found.', 404));
    }

    // Check content for moderation
    const flags = checkContentForModeration(content);

    const reply = await post.addReply(
      req.user._id,
      content,
      isAnonymous !== false
    );

    if (flags.length > 0) {
      logger.warn(`Reply flagged for moderation on post ${post._id}`);
    }

    res.status(201).json({
      status: 'success',
      data: {
        reply: {
          id: reply._id,
          content: reply.content,
          authorName: reply.isAnonymous ? post.generateAnonymousName() : req.user.name,
          isAnonymous: reply.isAnonymous,
          createdAt: reply.createdAt,
          likeCount: 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Like/unlike reply
 * POST /api/v1/forum/:postId/reply/:replyId/like
 */
exports.toggleReplyLike = async (req, res, next) => {
  try {
    const { postId, replyId } = req.params;

    const post = await ForumPost.findOne({
      _id: postId,
      status: 'active',
    });

    if (!post) {
      return next(new AppError('Post not found.', 404));
    }

    const reply = post.replies.id(replyId);
    if (!reply) {
      return next(new AppError('Reply not found.', 404));
    }

    const likeIndex = reply.likes.indexOf(req.user._id);
    let isLiked;

    if (likeIndex > -1) {
      reply.likes.splice(likeIndex, 1);
      isLiked = false;
    } else {
      reply.likes.push(req.user._id);
      isLiked = true;
    }

    await post.save();

    res.status(200).json({
      status: 'success',
      data: {
        isLiked,
        likeCount: reply.likes.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Report post
 * POST /api/v1/forum/:id/report
 */
exports.reportPost = async (req, res, next) => {
  try {
    const { reason, description } = req.body;

    const post = await ForumPost.findOne({
      _id: req.params.id,
      status: 'active',
    });

    if (!post) {
      return next(new AppError('Post not found.', 404));
    }

    // Check if user already reported
    const existingReport = post.reports.find(
      r => r.reportedBy.toString() === req.user._id.toString()
    );

    if (existingReport) {
      return next(new AppError('You have already reported this post.', 400));
    }

    post.reports.push({
      reportedBy: req.user._id,
      reason,
      description,
    });

    // Auto-flag if multiple reports
    if (post.reports.length >= 3) {
      post.status = 'pending';
      logger.warn(`Post auto-flagged due to multiple reports: ${post._id}`);
    }

    await post.save();

    res.status(200).json({
      status: 'success',
      message: 'Report submitted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get forum categories
 * GET /api/v1/forum/categories
 */
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await ForumPost.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const allCategories = [
      { id: 'general', name: 'General Discussion', icon: '💬' },
      { id: 'academic_stress', name: 'Academic Stress', icon: '📚' },
      { id: 'anxiety', name: 'Anxiety & Worry', icon: '🌊' },
      { id: 'depression', name: 'Depression & Low Mood', icon: '🌧️' },
      { id: 'relationships', name: 'Relationships', icon: '💕' },
      { id: 'self_care', name: 'Self-Care Tips', icon: '🌱' },
      { id: 'success_stories', name: 'Success Stories', icon: '⭐' },
      { id: 'resources', name: 'Resource Sharing', icon: '📖' },
    ];

    const categoriesWithCount = allCategories.map(cat => {
      const found = categories.find(c => c._id === cat.id);
      return { ...cat, postCount: found ? found.count : 0 };
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
 * Get user's posts
 * GET /api/v1/forum/my-posts
 */
exports.getMyPosts = async (req, res, next) => {
  try {
    const posts = await ForumPost.find({
      author: req.user._id,
      status: { $ne: 'deleted' },
    })
      .sort({ createdAt: -1 })
      .select('-reports -likes');

    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: {
        posts,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get reported posts (Admin/Counselor)
 * GET /api/v1/forum/reported
 */
exports.getReportedPosts = async (req, res, next) => {
  try {
    const posts = await ForumPost.find({
      $or: [
        { 'reports.0': { $exists: true } },
        { status: 'pending' },
      ],
    })
      .sort({ 'reports.length': -1 })
      .populate('reports.reportedBy', 'name');

    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: {
        posts,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Moderate post (Admin/Counselor)
 * POST /api/v1/forum/:id/moderate
 */
exports.moderatePost = async (req, res, next) => {
  try {
    const { action, reason } = req.body;

    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return next(new AppError('Post not found.', 404));
    }

    switch (action) {
      case 'approve':
        post.status = 'active';
        post.moderationFlags = [];
        break;
      case 'remove':
        post.status = 'removed';
        break;
      case 'flag':
        post.status = 'pending';
        if (reason) post.moderationFlags.push(reason);
        break;
      default:
        return next(new AppError('Invalid moderation action.', 400));
    }

    post.moderatedBy = req.user._id;
    post.moderatedAt = new Date();
    await post.save();

    logger.info(`Post ${post._id} moderated: ${action} by ${req.user._id}`);

    res.status(200).json({
      status: 'success',
      data: {
        post: {
          id: post._id,
          status: post.status,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Pin/unpin post (Admin/Counselor)
 * POST /api/v1/forum/:id/pin
 */
exports.togglePin = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return next(new AppError('Post not found.', 404));
    }

    post.isPinned = !post.isPinned;
    await post.save();

    res.status(200).json({
      status: 'success',
      data: {
        isPinned: post.isPinned,
      },
    });
  } catch (error) {
    next(error);
  }
};
