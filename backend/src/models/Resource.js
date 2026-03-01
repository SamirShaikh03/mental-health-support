/**
 * Resource Model
 * Mental health resources including videos, articles, and audio
 */

const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    // Resource type
    type: {
      type: String,
      required: [true, 'Resource type is required'],
      enum: ['video', 'article', 'audio', 'exercise', 'guide', 'infographic', 'podcast', 'external_link'],
      index: true,
    },
    // Category
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'anxiety', 'depression', 'stress', 'mindfulness',
        'meditation', 'breathing', 'sleep', 'relationships',
        'self_esteem', 'academics', 'crisis', 'general',
        'yoga', 'exercise', 'nutrition', 'substance'
      ],
      index: true,
    },
    // Subcategory for more specific filtering
    subcategory: {
      type: String,
      trim: true,
    },
    // Tags for search
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    // Content based on type
    content: {
      // For videos
      videoId: String, // YouTube video ID
      videoUrl: String,
      thumbnail: String,
      // For articles
      articleBody: String, // Markdown or HTML content
      // For audio
      audioUrl: String,
      // For exercises
      steps: [{
        stepNumber: Number,
        title: String,
        description: String,
        duration: Number, // seconds
      }],
      // For external links
      externalUrl: String,
    },
    // Duration (in seconds for video/audio, minutes for exercises)
    duration: {
      type: Number,
    },
    durationDisplay: {
      type: String, // e.g., "10:30" or "5 mins"
    },
    // Language
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'hi', 'mr', 'ur'],
    },
    // Difficulty/level
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    // Target audience
    audience: {
      type: String,
      enum: ['all', 'students', 'counselors', 'parents'],
      default: 'all',
    },
    // Author/source
    author: {
      name: String,
      credentials: String,
      organization: String,
    },
    source: {
      name: String,
      url: String,
    },
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
    saves: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    savesCount: {
      type: Number,
      default: 0,
    },
    // Ratings
    ratings: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      score: {
        type: Number,
        min: 1,
        max: 5,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    averageRating: {
      type: Number,
      default: 0,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
    // Completion tracking
    completions: {
      type: Number,
      default: 0,
    },
    // Status
    status: {
      type: String,
      enum: ['draft', 'published', 'archived', 'review'],
      default: 'published',
      index: true,
    },
    // Featured resource
    isFeatured: {
      type: Boolean,
      default: false,
    },
    featuredOrder: Number,
    // Related resources
    relatedResources: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
    }],
    // Prerequisites (for sequential learning)
    prerequisites: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
    }],
    // Metadata
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    publishedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
resourceSchema.index({ type: 1, category: 1, status: 1 });
resourceSchema.index({ tags: 1 });
resourceSchema.index({ status: 1, isFeatured: -1, featuredOrder: 1 });
resourceSchema.index({ '$**': 'text' }); // Text search

// Pre-save middleware
resourceSchema.pre('save', function(next) {
  // Update counts
  this.likesCount = this.likes?.length || 0;
  this.savesCount = this.saves?.length || 0;
  
  // Calculate average rating
  if (this.ratings && this.ratings.length > 0) {
    const totalScore = this.ratings.reduce((sum, r) => sum + r.score, 0);
    this.averageRating = Math.round((totalScore / this.ratings.length) * 10) / 10;
    this.ratingsCount = this.ratings.length;
  }
  
  next();
});

// Virtual for thumbnail URL
resourceSchema.virtual('thumbnailUrl').get(function() {
  if (this.content?.thumbnail) return this.content.thumbnail;
  if (this.content?.videoId) {
    return `https://img.youtube.com/vi/${this.content.videoId}/maxresdefault.jpg`;
  }
  return null;
});

// Static method to get featured resources
resourceSchema.statics.getFeatured = async function(limit = 10) {
  return await this.find({
    status: 'published',
    isFeatured: true,
  })
    .sort({ featuredOrder: 1 })
    .limit(limit);
};

// Static method to get resources by category
resourceSchema.statics.getByCategory = async function(category, type = null, page = 1, limit = 12) {
  const query = { status: 'published' };
  if (category !== 'all') query.category = category;
  if (type) query.type = type;

  const total = await this.countDocuments(query);
  const resources = await this.find(query)
    .sort({ isFeatured: -1, views: -1, createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    resources,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

// Static method to search resources
resourceSchema.statics.search = async function(searchTerm, page = 1, limit = 12) {
  const query = {
    status: 'published',
    $text: { $search: searchTerm },
  };

  const total = await this.countDocuments(query);
  const resources = await this.find(query, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .skip((page - 1) * limit)
    .limit(limit);

  return { resources, total, page, pages: Math.ceil(total / limit) };
};

// Static method to get recommended resources based on user activity
resourceSchema.statics.getRecommended = async function(userId, limit = 6) {
  // This would normally use ML or collaborative filtering
  // For now, return popular resources
  return await this.find({ status: 'published' })
    .sort({ views: -1, averageRating: -1 })
    .limit(limit);
};

// Instance method to record view
resourceSchema.methods.recordView = async function() {
  this.views += 1;
  return await this.save();
};

// Instance method to toggle like
resourceSchema.methods.toggleLike = async function(userId) {
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

// Instance method to add rating
resourceSchema.methods.addRating = async function(userId, score) {
  // Remove existing rating from this user
  this.ratings = this.ratings.filter(r => r.user.toString() !== userId.toString());
  
  // Add new rating
  this.ratings.push({ user: userId, score });
  
  // Recalculate average
  const totalScore = this.ratings.reduce((sum, r) => sum + r.score, 0);
  this.averageRating = Math.round((totalScore / this.ratings.length) * 10) / 10;
  this.ratingsCount = this.ratings.length;
  
  return await this.save();
};

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
