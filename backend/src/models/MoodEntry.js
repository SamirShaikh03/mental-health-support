/**
 * Mood Entry Model
 * Tracks daily mood check-ins and emotional states
 */

const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Mood entry must belong to a user'],
      index: true,
    },
    // Primary mood score (1-10)
    moodScore: {
      type: Number,
      required: [true, 'Mood score is required'],
      min: [1, 'Mood score must be at least 1'],
      max: [10, 'Mood score cannot exceed 10'],
    },
    // Additional metrics
    anxietyLevel: {
      type: Number,
      min: [1, 'Anxiety level must be at least 1'],
      max: [10, 'Anxiety level cannot exceed 10'],
    },
    energyLevel: {
      type: Number,
      min: [1, 'Energy level must be at least 1'],
      max: [10, 'Energy level cannot exceed 10'],
    },
    sleepQuality: {
      type: Number,
      min: [1, 'Sleep quality must be at least 1'],
      max: [10, 'Sleep quality cannot exceed 10'],
    },
    sleepHours: {
      type: Number,
      min: [0, 'Sleep hours cannot be negative'],
      max: [24, 'Sleep hours cannot exceed 24'],
    },
    // Emotions experienced (can select multiple)
    emotions: [{
      type: String,
      enum: [
        'happy', 'sad', 'anxious', 'calm', 'angry', 'frustrated',
        'hopeful', 'grateful', 'lonely', 'excited', 'stressed',
        'overwhelmed', 'content', 'nervous', 'peaceful', 'tired',
        'energetic', 'motivated', 'unmotivated', 'confused'
      ],
    }],
    // Activities that may have influenced mood
    activities: [{
      type: String,
      enum: [
        'exercise', 'meditation', 'socializing', 'work', 'study',
        'hobby', 'outdoors', 'reading', 'gaming', 'music',
        'therapy', 'journaling', 'yoga', 'breathing', 'walking',
        'eating_well', 'poor_sleep', 'caffeine', 'alcohol'
      ],
    }],
    // Factors affecting mood
    factors: [{
      type: String,
      enum: [
        'academic_stress', 'relationship_issues', 'family_problems',
        'financial_worry', 'health_concerns', 'social_anxiety',
        'work_pressure', 'sleep_issues', 'diet', 'weather',
        'medication', 'positive_event', 'achievement', 'conflict'
      ],
    }],
    // Optional notes
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    // Weather at time of entry (optional)
    weather: {
      type: String,
      enum: ['sunny', 'cloudy', 'rainy', 'stormy', 'snowy', 'cold', 'hot', 'mild'],
    },
    // Time of day
    timeOfDay: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'night'],
      default: function() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 21) return 'evening';
        return 'night';
      },
    },
    // Date of the mood entry (for querying by day)
    date: {
      type: Date,
      default: function() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
      },
      index: true,
    },
    // Flag for crisis/concerning entries
    isConcerning: {
      type: Boolean,
      default: false,
    },
    // Flag if user indicated self-harm thoughts
    hasHarmThoughts: {
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

// Compound index for efficient queries
moodEntrySchema.index({ user: 1, date: -1 });
moodEntrySchema.index({ user: 1, createdAt: -1 });

// Pre-save middleware to flag concerning entries
moodEntrySchema.pre('save', function(next) {
  // Flag as concerning if mood is very low or has anxiety concerns
  if (this.moodScore <= 3 || this.anxietyLevel >= 8 || this.hasHarmThoughts) {
    this.isConcerning = true;
  }
  next();
});

// Virtual for mood category
moodEntrySchema.virtual('moodCategory').get(function() {
  if (this.moodScore >= 8) return 'excellent';
  if (this.moodScore >= 6) return 'good';
  if (this.moodScore >= 4) return 'moderate';
  if (this.moodScore >= 2) return 'poor';
  return 'critical';
});

// Static method to get user's mood statistics
moodEntrySchema.statics.getUserStats = async function(userId, days = 30) {
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
        avgMood: { $avg: '$moodScore' },
        avgAnxiety: { $avg: '$anxietyLevel' },
        avgEnergy: { $avg: '$energyLevel' },
        avgSleep: { $avg: '$sleepHours' },
        totalEntries: { $sum: 1 },
        minMood: { $min: '$moodScore' },
        maxMood: { $max: '$moodScore' },
      },
    },
  ]);

  return stats[0] || {
    avgMood: 0,
    avgAnxiety: 0,
    avgEnergy: 0,
    avgSleep: 0,
    totalEntries: 0,
    minMood: 0,
    maxMood: 0,
  };
};

// Static method to get mood trends
moodEntrySchema.statics.getMoodTrends = async function(userId, days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return await this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        avgMood: { $avg: '$moodScore' },
        avgAnxiety: { $avg: '$anxietyLevel' },
        avgEnergy: { $avg: '$energyLevel' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

const MoodEntry = mongoose.model('MoodEntry', moodEntrySchema);

module.exports = MoodEntry;
