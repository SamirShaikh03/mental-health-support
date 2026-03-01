/**
 * Screening Result Model
 * Stores mental health screening test results
 */

const mongoose = require('mongoose');

const screeningResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Screening must belong to a user'],
      index: true,
    },
    // Test type
    testType: {
      type: String,
      required: [true, 'Test type is required'],
      enum: ['phq9', 'gad7', 'stress', 'ghq12', 'dass21', 'custom'],
      index: true,
    },
    // Test metadata
    testName: {
      type: String,
      required: true,
    },
    testVersion: {
      type: String,
      default: '1.0',
    },
    // Answers
    answers: [{
      questionIndex: {
        type: Number,
        required: true,
      },
      questionText: {
        type: String,
        required: true,
      },
      answer: {
        type: Number,
        required: true,
      },
      answerText: String,
    }],
    // Scores
    totalScore: {
      type: Number,
      required: true,
    },
    maxScore: {
      type: Number,
      required: true,
    },
    percentageScore: {
      type: Number,
    },
    // For tests with subscales (like DASS-21)
    subscales: [{
      name: String,
      score: Number,
      maxScore: Number,
      severity: String,
    }],
    // Severity interpretation
    severity: {
      level: {
        type: String,
        required: true,
        enum: ['minimal', 'mild', 'moderate', 'moderately_severe', 'severe', 'low', 'high', 'very_high'],
      },
      label: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        default: '#6b7280',
      },
    },
    // Risk assessment
    riskLevel: {
      type: String,
      enum: ['none', 'low', 'moderate', 'high', 'critical'],
      default: 'none',
    },
    // Critical question flags
    criticalFlags: [{
      questionIndex: Number,
      questionText: String,
      answer: Number,
      flag: String,
    }],
    // Whether result indicates need for immediate attention
    requiresAttention: {
      type: Boolean,
      default: false,
    },
    // Whether counselor has been notified
    counselorNotified: {
      type: Boolean,
      default: false,
    },
    notifiedAt: Date,
    // Recommendations based on results
    recommendations: [{
      type: {
        type: String,
        enum: ['action', 'resource', 'follow_up', 'appointment', 'crisis'],
      },
      title: String,
      description: String,
      priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
      },
    }],
    // Completion details
    completionTime: {
      type: Number, // in seconds
    },
    startedAt: Date,
    completedAt: {
      type: Date,
      default: Date.now,
    },
    // Device/context
    deviceType: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet'],
    },
    userAgent: String,
    // Whether user has viewed results
    resultsViewed: {
      type: Boolean,
      default: false,
    },
    viewedAt: Date,
    // Whether user has taken follow-up action
    followUpAction: {
      taken: Boolean,
      action: String,
      actionDate: Date,
    },
    // Privacy - whether result is shared
    isSharedWithCounselor: {
      type: Boolean,
      default: false,
    },
    // Anonymized for analytics
    isAnonymized: {
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
screeningResultSchema.index({ user: 1, testType: 1, createdAt: -1 });
screeningResultSchema.index({ testType: 1, createdAt: -1 });
screeningResultSchema.index({ severity: 1, createdAt: -1 });
screeningResultSchema.index({ requiresAttention: 1, counselorNotified: 1 });

// Pre-save middleware
screeningResultSchema.pre('save', function(next) {
  // Calculate percentage score
  if (this.totalScore !== undefined && this.maxScore) {
    this.percentageScore = Math.round((this.totalScore / this.maxScore) * 100);
  }

  // Determine if requires attention based on severity
  const highRiskSeverities = ['severe', 'moderately_severe', 'high', 'very_high', 'critical'];
  if (highRiskSeverities.includes(this.severity?.level)) {
    this.requiresAttention = true;
    this.riskLevel = 'high';
  }

  // Check for critical flags (e.g., self-harm questions)
  if (this.criticalFlags && this.criticalFlags.length > 0) {
    this.requiresAttention = true;
    this.riskLevel = 'critical';
  }

  next();
});

// Virtual for test display name
screeningResultSchema.virtual('testDisplayName').get(function() {
  const names = {
    phq9: 'PHQ-9 Depression Screening',
    gad7: 'GAD-7 Anxiety Screening',
    stress: 'Student Stress Assessment',
    ghq12: 'General Health Questionnaire',
    dass21: 'DASS-21 Assessment',
  };
  return names[this.testType] || this.testName;
});

// Static method to get user's screening history
screeningResultSchema.statics.getUserHistory = async function(userId, testType = null) {
  const query = { user: userId };
  if (testType) query.testType = testType;

  return await this.find(query)
    .sort({ createdAt: -1 })
    .select('-answers -userAgent')
    .limit(50);
};

// Static method to get results needing attention
screeningResultSchema.statics.getRequiringAttention = async function() {
  return await this.find({
    requiresAttention: true,
    counselorNotified: false,
  })
    .populate('user', 'firstName lastName email')
    .sort({ createdAt: -1 });
};

// Static method for anonymous analytics
screeningResultSchema.statics.getAnonymousStats = async function(testType, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return await this.aggregate([
    {
      $match: {
        testType,
        isAnonymized: true,
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: '$severity.level',
        count: { $sum: 1 },
        avgScore: { $avg: '$totalScore' },
      },
    },
    { $sort: { count: -1 } },
  ]);
};

// Static method to compare user progress over time
screeningResultSchema.statics.getUserProgress = async function(userId, testType) {
  return await this.find({
    user: userId,
    testType,
  })
    .sort({ createdAt: 1 })
    .select('totalScore percentageScore severity createdAt')
    .lean();
};

const ScreeningResult = mongoose.model('ScreeningResult', screeningResultSchema);

module.exports = ScreeningResult;
