/**
 * Chat Session Model
 * Stores AI chat sessions and conversation history
 */

const mongoose = require('mongoose');

// Message Schema (embedded document)
const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ['user', 'assistant', 'system'],
    },
    content: {
      type: String,
      required: true,
      maxlength: [10000, 'Message cannot exceed 10000 characters'],
    },
    // AI source that generated the response
    source: {
      type: String,
      enum: ['openai', 'gemini', 'fallback', 'system', 'mood-guide', 'local-fallback'],
    },
    // Tokens used (for tracking)
    tokensUsed: {
      prompt: Number,
      completion: Number,
    },
    // Message timestamp
    timestamp: {
      type: Date,
      default: Date.now,
    },
    // Was this flagged for review
    isFlagged: {
      type: Boolean,
      default: false,
    },
    flagReason: String,
  },
  { _id: true }
);

const chatSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Chat session must belong to a user'],
      index: true,
    },
    // Session identifier
    sessionId: {
      type: String,
      required: true,
      unique: true,
      default: () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    },
    // Session title (auto-generated or user-set)
    title: {
      type: String,
      default: 'New Conversation',
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    // Messages in this session
    messages: [messageSchema],
    messageCount: {
      type: Number,
      default: 0,
    },
    // Session metadata
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: Date,
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    // Duration in minutes
    duration: {
      type: Number,
      default: 0,
    },
    // Initial mood at session start
    initialMood: {
      type: String,
      enum: ['steady', 'overwhelmed', 'anxious', 'drained', null],
    },
    // Session status
    status: {
      type: String,
      enum: ['active', 'ended', 'archived'],
      default: 'active',
    },
    // AI provider preference for this session
    aiProvider: {
      type: String,
      enum: ['openai', 'gemini', 'auto'],
      default: 'auto',
    },
    // Total tokens used in session
    totalTokens: {
      prompt: { type: Number, default: 0 },
      completion: { type: Number, default: 0 },
    },
    // Session rating (user feedback)
    rating: {
      score: {
        type: Number,
        min: 1,
        max: 5,
      },
      feedback: {
        type: String,
        maxlength: [500, 'Feedback cannot exceed 500 characters'],
      },
      submittedAt: Date,
    },
    // Topics discussed (for categorization)
    topics: [{
      type: String,
      enum: [
        'anxiety', 'depression', 'stress', 'relationships',
        'academics', 'career', 'family', 'grief', 'self_esteem',
        'sleep', 'eating', 'general', 'crisis', 'grounding',
        'breathing', 'coping', 'other'
      ],
    }],
    // Risk/concern flags
    containsConcerningContent: {
      type: Boolean,
      default: false,
    },
    concernFlags: [{
      type: {
        type: String,
        enum: ['self_harm', 'crisis', 'abuse', 'violence', 'substance'],
      },
      messageIndex: Number,
      timestamp: Date,
      reviewed: Boolean,
      reviewedBy: mongoose.Schema.Types.ObjectId,
    }],
    // Whether session was reviewed by counselor
    counselorReviewed: {
      type: Boolean,
      default: false,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: Date,
    reviewNotes: String,
    // Device info
    deviceType: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet'],
    },
    // Is bookmarked
    isBookmarked: {
      type: Boolean,
      default: false,
    },
    // Is archived
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
// Note: sessionId index is created automatically by unique: true
chatSessionSchema.index({ user: 1, createdAt: -1 });
chatSessionSchema.index({ status: 1, lastMessageAt: -1 });
chatSessionSchema.index({ containsConcerningContent: 1, counselorReviewed: 1 });

// Pre-save middleware
chatSessionSchema.pre('save', function(next) {
  // Update message count
  this.messageCount = this.messages?.length || 0;
  
  // Update last message time
  if (this.messages && this.messages.length > 0) {
    this.lastMessageAt = this.messages[this.messages.length - 1].timestamp;
  }
  
  // Calculate duration if session has ended
  if (this.endedAt && this.startedAt) {
    this.duration = Math.round((this.endedAt - this.startedAt) / (1000 * 60));
  }
  
  next();
});

// Virtual for preview (first user message)
chatSessionSchema.virtual('preview').get(function() {
  const firstUserMessage = this.messages?.find(m => m.role === 'user');
  if (!firstUserMessage) return 'New conversation';
  return firstUserMessage.content.length > 100
    ? firstUserMessage.content.substring(0, 100) + '...'
    : firstUserMessage.content;
});

// Instance method to add message
chatSessionSchema.methods.addMessage = async function(role, content, source = null, tokensUsed = null) {
  const message = {
    role,
    content,
    source,
    tokensUsed,
    timestamp: new Date(),
  };
  
  this.messages.push(message);
  this.lastMessageAt = message.timestamp;
  
  // Update token counts
  if (tokensUsed) {
    this.totalTokens.prompt += tokensUsed.prompt || 0;
    this.totalTokens.completion += tokensUsed.completion || 0;
  }
  
  return await this.save();
};

// Instance method to end session
chatSessionSchema.methods.endSession = async function() {
  this.status = 'ended';
  this.endedAt = new Date();
  return await this.save();
};

// Static method to get user's recent sessions
chatSessionSchema.statics.getUserSessions = async function(userId, limit = 20) {
  return await this.find({
    user: userId,
    isArchived: false,
  })
    .sort({ lastMessageAt: -1 })
    .limit(limit)
    .select('-messages.content'); // Don't include full message content for list view
};

// Static method to get active session or create new one
chatSessionSchema.statics.getOrCreateSession = async function(userId) {
  // Try to find an active session from today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let session = await this.findOne({
    user: userId,
    status: 'active',
    createdAt: { $gte: today },
  });

  if (!session) {
    session = await this.create({
      user: userId,
      title: `Conversation - ${new Date().toLocaleDateString()}`,
    });
  }

  return session;
};

// Static method to get sessions needing review
chatSessionSchema.statics.getSessionsNeedingReview = async function() {
  return await this.find({
    containsConcerningContent: true,
    counselorReviewed: false,
  })
    .populate('user', 'firstName lastName email')
    .sort({ createdAt: -1 });
};

// Static method to get chat statistics
chatSessionSchema.statics.getStats = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const stats = await this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        totalMessages: { $sum: '$messageCount' },
        avgMessagesPerSession: { $avg: '$messageCount' },
        avgDuration: { $avg: '$duration' },
        totalTokens: {
          $sum: { $add: ['$totalTokens.prompt', '$totalTokens.completion'] },
        },
      },
    },
  ]);

  return stats[0] || {
    totalSessions: 0,
    totalMessages: 0,
    avgMessagesPerSession: 0,
    avgDuration: 0,
    totalTokens: 0,
  };
};

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

module.exports = ChatSession;
