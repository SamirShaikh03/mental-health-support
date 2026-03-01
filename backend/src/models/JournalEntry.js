/**
 * Journal Entry Model
 * Private journaling system for self-reflection
 */

const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Journal entry must belong to a user'],
      index: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Journal content is required'],
      maxlength: [10000, 'Content cannot exceed 10000 characters'],
    },
    // Journal type/prompt
    type: {
      type: String,
      enum: ['free_write', 'gratitude', 'reflection', 'goals', 'mood', 'prompt', 'daily'],
      default: 'free_write',
    },
    // Prompt used if applicable
    prompt: {
      type: String,
      maxlength: [500, 'Prompt cannot exceed 500 characters'],
    },
    // Mood at time of writing
    mood: {
      type: Number,
      min: 1,
      max: 10,
    },
    // Tags for organization
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [30, 'Tag cannot exceed 30 characters'],
    }],
    // Gratitude items (for gratitude journals)
    gratitudeItems: [{
      type: String,
      trim: true,
      maxlength: [200, 'Gratitude item cannot exceed 200 characters'],
    }],
    // Goals (for goal-setting journals)
    goals: [{
      text: {
        type: String,
        maxlength: [500, 'Goal text cannot exceed 500 characters'],
      },
      completed: {
        type: Boolean,
        default: false,
      },
      completedAt: Date,
    }],
    // Privacy settings
    isPrivate: {
      type: Boolean,
      default: true,
    },
    // Can be shared with counselor
    sharedWithCounselor: {
      type: Boolean,
      default: false,
    },
    // Word count
    wordCount: {
      type: Number,
      default: 0,
    },
    // Reading time estimate (minutes)
    readingTime: {
      type: Number,
      default: 1,
    },
    // Favorite/starred entry
    isFavorite: {
      type: Boolean,
      default: false,
    },
    // Archived entry
    isArchived: {
      type: Boolean,
      default: false,
    },
    // Date for the journal entry
    entryDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
journalEntrySchema.index({ user: 1, entryDate: -1 });
journalEntrySchema.index({ user: 1, createdAt: -1 });
journalEntrySchema.index({ user: 1, tags: 1 });
journalEntrySchema.index({ user: 1, type: 1 });

// Pre-save middleware to calculate word count and reading time
journalEntrySchema.pre('save', function(next) {
  if (this.content) {
    // Calculate word count
    this.wordCount = this.content.trim().split(/\s+/).length;
    // Estimate reading time (average 200 words per minute)
    this.readingTime = Math.ceil(this.wordCount / 200) || 1;
  }
  next();
});

// Virtual for preview (first 150 characters)
journalEntrySchema.virtual('preview').get(function() {
  if (!this.content) return '';
  return this.content.length > 150 
    ? this.content.substring(0, 150) + '...'
    : this.content;
});

// Static method to get journal statistics
journalEntrySchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalEntries: { $sum: 1 },
        totalWords: { $sum: '$wordCount' },
        avgWordCount: { $avg: '$wordCount' },
        gratitudeEntries: {
          $sum: { $cond: [{ $eq: ['$type', 'gratitude'] }, 1, 0] },
        },
        reflectionEntries: {
          $sum: { $cond: [{ $eq: ['$type', 'reflection'] }, 1, 0] },
        },
      },
    },
  ]);

  return stats[0] || {
    totalEntries: 0,
    totalWords: 0,
    avgWordCount: 0,
    gratitudeEntries: 0,
    reflectionEntries: 0,
  };
};

// Static method to get streak information
journalEntrySchema.statics.getStreak = async function(userId) {
  const entries = await this.find({ user: userId })
    .sort({ entryDate: -1 })
    .select('entryDate')
    .lean();

  if (entries.length === 0) return { current: 0, longest: 0 };

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;
  let lastDate = new Date(entries[0].entryDate);
  lastDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if there's an entry today or yesterday
  const diffToday = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
  if (diffToday <= 1) {
    currentStreak = 1;
  }

  for (let i = 1; i < entries.length; i++) {
    const currentDate = new Date(entries[i].entryDate);
    currentDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((lastDate - currentDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      tempStreak++;
      if (diffToday <= 1 && i < entries.length) {
        currentStreak = tempStreak;
      }
    } else if (diffDays > 1) {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }

    lastDate = currentDate;
  }

  longestStreak = Math.max(longestStreak, tempStreak);

  return { current: currentStreak, longest: longestStreak };
};

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);

module.exports = JournalEntry;
