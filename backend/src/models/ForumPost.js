/**
 * Forum Post Model
 * Peer support forum posts and discussions
 */

const mongoose = require('mongoose');
const slugify = require('slugify');

// Reply Schema (embedded document)
const replySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Anonymous author name
    authorName: {
      type: String,
      default: 'Anonymous Helper',
    },
    isAnonymous: {
      type: Boolean,
      default: true,
    },
    content: {
      type: String,
      required: [true, 'Reply content is required'],
      maxlength: [2000, 'Reply cannot exceed 2000 characters'],
    },
    // Is author a trained volunteer
    isVolunteer: {
      type: Boolean,
      default: false,
    },
    // Is author a counselor
    isCounselor: {
      type: Boolean,
      default: false,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    likesCount: {
      type: Number,
      default: 0,
    },
    // Reply status
    status: {
      type: String,
      enum: ['visible', 'hidden', 'flagged', 'removed'],
      default: 'visible',
    },
    // Reports
    reports: [{
      reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      reason: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  {
    timestamps: true,
  }
);

// Main Forum Post Schema
const forumPostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Post must have an author'],
      index: true,
    },
    // Anonymous author name
    authorName: {
      type: String,
      default: 'Anonymous Student',
    },
    isAnonymous: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
      maxlength: [5000, 'Content cannot exceed 5000 characters'],
    },
    // Category
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'general',
        'anxiety',
        'depression',
        'stress',
        'relationships',
        'academics',
        'career',
        'family',
        'grief',
        'self_esteem',
        'sleep',
        'eating',
        'substance',
        'other'
      ],
      default: 'general',
      index: true,
    },
    // Tags
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [30, 'Tag cannot exceed 30 characters'],
    }],
    // Engagement metrics
    views: {
      type: Number,
      default: 0,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    likesCount: {
      type: Number,
      default: 0,
    },
    bookmarks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    bookmarksCount: {
      type: Number,
      default: 0,
    },
    // Replies
    replies: [replySchema],
    repliesCount: {
      type: Number,
      default: 0,
    },
    // Last activity (for sorting)
    lastActivity: {
      type: Date,
      default: Date.now,
      index: true,
    },
    // Post status
    status: {
      type: String,
      enum: ['published', 'draft', 'hidden', 'flagged', 'removed', 'locked'],
      default: 'published',
      index: true,
    },
    // Pinned posts
    isPinned: {
      type: Boolean,
      default: false,
    },
    pinnedAt: Date,
    // Featured posts
    isFeatured: {
      type: Boolean,
      default: false,
    },
    // Reports
    reports: [{
      reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      reason: {
        type: String,
        enum: ['spam', 'inappropriate', 'harassment', 'misinformation', 'self_harm', 'other'],
      },
      description: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
      reviewed: {
        type: Boolean,
        default: false,
      },
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      reviewedAt: Date,
      action: String,
    }],
    reportsCount: {
      type: Number,
      default: 0,
    },
    // Moderation
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    moderatedAt: Date,
    moderationNote: String,
    // Contains sensitive content warning
    hasSensitiveContent: {
      type: Boolean,
      default: false,
    },
    // Trigger warning
    triggerWarning: {
      type: String,
      maxlength: [200, 'Trigger warning cannot exceed 200 characters'],
    },
    // Allow replies
    allowReplies: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
forumPostSchema.index({ category: 1, status: 1, lastActivity: -1 });
forumPostSchema.index({ tags: 1 });
forumPostSchema.index({ status: 1, isPinned: -1, lastActivity: -1 });
forumPostSchema.index({ author: 1, createdAt: -1 });
forumPostSchema.index({ '$**': 'text' }); // Text search index

// Pre-save middleware
forumPostSchema.pre('save', function(next) {
  // Generate slug
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now();
  }

  // Update counts
  this.repliesCount = this.replies?.length || 0;
  this.likesCount = this.likes?.length || 0;
  this.bookmarksCount = this.bookmarks?.length || 0;
  this.reportsCount = this.reports?.length || 0;

  // Update reply counts
  if (this.replies) {
    this.replies.forEach(reply => {
      reply.likesCount = reply.likes?.length || 0;
    });
  }

  next();
});

// Virtual for preview
forumPostSchema.virtual('preview').get(function() {
  if (!this.content) return '';
  return this.content.length > 200 
    ? this.content.substring(0, 200) + '...'
    : this.content;
});

// Virtual for engagement score (for sorting)
forumPostSchema.virtual('engagementScore').get(function() {
  const viewWeight = 0.1;
  const likeWeight = 2;
  const replyWeight = 3;
  
  return (
    (this.views * viewWeight) +
    (this.likesCount * likeWeight) +
    (this.repliesCount * replyWeight)
  );
});

// Static method to get trending posts
forumPostSchema.statics.getTrending = async function(limit = 10, days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return await this.find({
    status: 'published',
    createdAt: { $gte: startDate },
  })
    .sort({ likesCount: -1, repliesCount: -1, views: -1 })
    .limit(limit)
    .select('-reports -replies.reports');
};

// Static method to get posts by category with pagination
forumPostSchema.statics.getByCategory = async function(category, page = 1, limit = 10) {
  const query = { status: 'published' };
  if (category !== 'all') query.category = category;

  const total = await this.countDocuments(query);
  const posts = await this.find(query)
    .sort({ isPinned: -1, lastActivity: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .select('-reports -replies.reports');

  return {
    posts,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

// Static method to search posts
forumPostSchema.statics.search = async function(searchTerm, page = 1, limit = 10) {
  const query = {
    status: 'published',
    $text: { $search: searchTerm },
  };

  const total = await this.countDocuments(query);
  const posts = await this.find(query, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .skip((page - 1) * limit)
    .limit(limit)
    .select('-reports -replies.reports');

  return { posts, total, page, pages: Math.ceil(total / limit) };
};

// Instance method to add reply
forumPostSchema.methods.addReply = async function(replyData) {
  this.replies.push(replyData);
  this.lastActivity = new Date();
  return await this.save();
};

// Instance method to toggle like
forumPostSchema.methods.toggleLike = async function(userId) {
  const userIdStr = userId.toString();
  const index = this.likes.findIndex(id => id.toString() === userIdStr);
  
  if (index > -1) {
    this.likes.splice(index, 1);
  } else {
    this.likes.push(userId);
  }
  
  this.likesCount = this.likes.length;
  return await this.save();
};

const ForumPost = mongoose.model('ForumPost', forumPostSchema);

module.exports = ForumPost;
