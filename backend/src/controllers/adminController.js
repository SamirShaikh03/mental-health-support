/**
 * Admin Controller
 * Handles anonymous analytics and admin dashboard functionality
 */

const User = require('../models/User');
const MoodEntry = require('../models/MoodEntry');
const JournalEntry = require('../models/JournalEntry');
const Appointment = require('../models/Appointment');
const ScreeningResult = require('../models/ScreeningResult');
const ForumPost = require('../models/ForumPost');
const ChatSession = require('../models/ChatSession');
const Resource = require('../models/Resource');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * Get dashboard overview stats (Admin)
 * GET /api/v1/admin/dashboard
 */
exports.getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    
    const thisMonth = new Date();
    thisMonth.setMonth(thisMonth.getMonth() - 1);

    // User stats (anonymous counts only)
    const userStats = {
      total: await User.countDocuments(),
      students: await User.countDocuments({ role: 'student' }),
      counselors: await User.countDocuments({ role: 'counselor' }),
      newThisWeek: await User.countDocuments({ createdAt: { $gte: thisWeek } }),
      activeToday: await User.countDocuments({ lastActive: { $gte: today } }),
    };

    // Mood entries stats
    const moodStats = {
      totalEntries: await MoodEntry.countDocuments(),
      entriesThisWeek: await MoodEntry.countDocuments({ createdAt: { $gte: thisWeek } }),
      concerningEntries: await MoodEntry.countDocuments({ isConcerning: true, createdAt: { $gte: thisWeek } }),
    };

    // Appointment stats
    const appointmentStats = {
      total: await Appointment.countDocuments(),
      scheduled: await Appointment.countDocuments({ status: 'scheduled' }),
      completedThisMonth: await Appointment.countDocuments({ 
        status: 'completed',
        createdAt: { $gte: thisMonth },
      }),
      pendingApproval: await Appointment.countDocuments({ status: 'pending' }),
    };

    // Screening stats
    const screeningStats = {
      totalAssessments: await ScreeningResult.countDocuments(),
      thisWeek: await ScreeningResult.countDocuments({ createdAt: { $gte: thisWeek } }),
      highRisk: await ScreeningResult.countDocuments({
        'severity.level': { $in: ['severe', 'moderately_severe'] },
        createdAt: { $gte: thisMonth },
      }),
    };

    // Forum stats
    const forumStats = {
      totalPosts: await ForumPost.countDocuments({ status: 'active' }),
      postsThisWeek: await ForumPost.countDocuments({ 
        status: 'active',
        createdAt: { $gte: thisWeek },
      }),
      reportedPosts: await ForumPost.countDocuments({
        'reports.0': { $exists: true },
      }),
    };

    // Chat stats
    const chatStats = {
      totalSessions: await ChatSession.countDocuments(),
      sessionsThisWeek: await ChatSession.countDocuments({ createdAt: { $gte: thisWeek } }),
      flaggedSessions: await ChatSession.countDocuments({
        'concernFlags.0': { $exists: true },
      }),
    };

    res.status(200).json({
      status: 'success',
      data: {
        users: userStats,
        mood: moodStats,
        appointments: appointmentStats,
        screening: screeningStats,
        forum: forumStats,
        chat: chatStats,
        lastUpdated: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get anonymized mood trends (Admin)
 * GET /api/v1/admin/analytics/mood
 */
exports.getMoodAnalytics = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Daily average mood scores
    const dailyAverages = await MoodEntry.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          avgMood: { $avg: '$moodScore' },
          avgEnergy: { $avg: '$energyLevel' },
          avgStress: { $avg: '$stressLevel' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Emotion distribution
    const emotionDistribution = await MoodEntry.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $unwind: '$emotions' },
      { $group: { _id: '$emotions', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Activity impact on mood
    const activityImpact = await MoodEntry.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $unwind: '$activities' },
      {
        $group: {
          _id: '$activities',
          avgMood: { $avg: '$moodScore' },
          count: { $sum: 1 },
        },
      },
      { $sort: { avgMood: -1 } },
      { $limit: 10 },
    ]);

    // Concerning entries trend
    const concerningTrend = await MoodEntry.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          concerning: {
            $sum: { $cond: ['$isConcerning', 1, 0] },
          },
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        dailyAverages,
        emotionDistribution,
        activityImpact,
        concerningTrend,
        period: `${days} days`,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get screening analytics (Admin)
 * GET /api/v1/admin/analytics/screening
 */
exports.getScreeningAnalytics = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Test distribution
    const testDistribution = await ScreeningResult.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$testType', count: { $sum: 1 } } },
    ]);

    // Severity distribution by test type
    const severityByTest = await ScreeningResult.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { testType: '$testType', severity: '$severity.level' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.testType': 1, count: -1 } },
    ]);

    // Weekly trend
    const weeklyTrend = await ScreeningResult.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            week: { $isoWeek: '$createdAt' },
            year: { $isoWeekYear: '$createdAt' },
          },
          avgScore: { $avg: '$percentageScore' },
          count: { $sum: 1 },
          highRisk: {
            $sum: {
              $cond: [
                { $in: ['$severity.level', ['severe', 'moderately_severe']] },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        testDistribution,
        severityByTest,
        weeklyTrend,
        period: `${days} days`,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get appointment analytics (Admin)
 * GET /api/v1/admin/analytics/appointments
 */
exports.getAppointmentAnalytics = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Status distribution
    const statusDistribution = await Appointment.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Type distribution
    const typeDistribution = await Appointment.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    // Daily appointments
    const dailyAppointments = await Appointment.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$scheduledAt' } },
          count: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Counselor workload (anonymous)
    const counselorWorkload = await Appointment.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ['scheduled', 'completed'] },
        },
      },
      {
        $group: {
          _id: '$counselor',
          appointments: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
        },
      },
      { $sort: { appointments: -1 } },
    ]);

    // Average feedback rating
    const feedbackStats = await Appointment.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          'feedback.rating': { $exists: true },
        },
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$feedback.rating' },
          totalFeedback: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        statusDistribution,
        typeDistribution,
        dailyAppointments,
        counselorWorkload: counselorWorkload.length,
        feedbackStats: feedbackStats[0] || { avgRating: 0, totalFeedback: 0 },
        period: `${days} days`,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get engagement analytics (Admin)
 * GET /api/v1/admin/analytics/engagement
 */
exports.getEngagementAnalytics = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Daily active users
    const dailyActiveUsers = await User.aggregate([
      { $match: { lastActive: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$lastActive' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Feature usage
    const featureUsage = {
      moodTracking: await MoodEntry.countDocuments({ createdAt: { $gte: startDate } }),
      journaling: await JournalEntry.countDocuments({ createdAt: { $gte: startDate } }),
      chatSessions: await ChatSession.countDocuments({ createdAt: { $gte: startDate } }),
      forumPosts: await ForumPost.countDocuments({ createdAt: { $gte: startDate } }),
      screenings: await ScreeningResult.countDocuments({ createdAt: { $gte: startDate } }),
      appointments: await Appointment.countDocuments({ createdAt: { $gte: startDate } }),
    };

    // User streaks distribution
    const streakDistribution = await User.aggregate([
      { $match: { role: 'student' } },
      {
        $bucket: {
          groupBy: '$streakCount',
          boundaries: [0, 7, 14, 30, 60, 100, Infinity],
          default: 'Other',
          output: {
            count: { $sum: 1 },
          },
        },
      },
    ]);

    // New user retention (users who returned after first day)
    const newUsers = await User.find({
      createdAt: { $gte: startDate },
    }).select('createdAt lastActive');

    const retainedUsers = newUsers.filter(user => {
      const dayAfterCreation = new Date(user.createdAt);
      dayAfterCreation.setDate(dayAfterCreation.getDate() + 1);
      return user.lastActive > dayAfterCreation;
    });

    const retentionRate = newUsers.length > 0
      ? (retainedUsers.length / newUsers.length * 100).toFixed(1)
      : 0;

    res.status(200).json({
      status: 'success',
      data: {
        dailyActiveUsers,
        featureUsage,
        streakDistribution,
        retention: {
          newUsers: newUsers.length,
          retained: retainedUsers.length,
          rate: parseFloat(retentionRate),
        },
        period: `${days} days`,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get alerts and concerns (Admin)
 * GET /api/v1/admin/alerts
 */
exports.getAlerts = async (req, res, next) => {
  try {
    const alerts = [];

    // High-risk screening results
    const highRiskScreenings = await ScreeningResult.find({
      requiresAttention: true,
      'followUpAction.taken': { $ne: true },
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email');

    highRiskScreenings.forEach(screening => {
      alerts.push({
        type: 'screening',
        severity: 'high',
        message: `High-risk ${screening.testType} result`,
        userId: screening.user._id,
        userName: screening.user.name,
        createdAt: screening.createdAt,
        id: screening._id,
      });
    });

    // Flagged chat sessions
    const flaggedChats = await ChatSession.find({
      'concernFlags.0': { $exists: true },
    })
      .sort({ 'concernFlags.flaggedAt': -1 })
      .limit(10)
      .populate('user', 'name email');

    flaggedChats.forEach(chat => {
      alerts.push({
        type: 'chat',
        severity: chat.concernFlags[0]?.severity || 'medium',
        message: 'Crisis keywords detected in chat',
        userId: chat.user._id,
        userName: chat.user.name,
        createdAt: chat.concernFlags[0]?.flaggedAt || chat.createdAt,
        id: chat._id,
      });
    });

    // Concerning mood entries
    const concerningMoods = await MoodEntry.find({
      isConcerning: true,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email');

    concerningMoods.forEach(mood => {
      alerts.push({
        type: 'mood',
        severity: mood.factors?.includes('thoughts_of_self_harm') ? 'high' : 'medium',
        message: `Concerning mood entry (score: ${mood.moodScore}/10)`,
        userId: mood.user._id,
        userName: mood.user.name,
        createdAt: mood.createdAt,
        id: mood._id,
      });
    });

    // Reported forum posts
    const reportedPosts = await ForumPost.find({
      'reports.0': { $exists: true },
      status: { $ne: 'removed' },
    })
      .sort({ 'reports.length': -1 })
      .limit(5);

    reportedPosts.forEach(post => {
      alerts.push({
        type: 'forum',
        severity: post.reports.length >= 3 ? 'high' : 'medium',
        message: `Forum post reported ${post.reports.length} times`,
        createdAt: post.reports[post.reports.length - 1]?.reportedAt,
        id: post._id,
      });
    });

    // Sort all alerts by severity and date
    const severityOrder = { high: 0, medium: 1, low: 2 };
    alerts.sort((a, b) => {
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[a.severity] - severityOrder[b.severity];
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.status(200).json({
      status: 'success',
      results: alerts.length,
      data: {
        alerts: alerts.slice(0, 50),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user summary (Admin - for following up on alerts)
 * GET /api/v1/admin/user/:userId/summary
 */
exports.getUserSummary = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('name email role createdAt lastActive streakCount emergencyContact');

    if (!user) {
      return next(new AppError('User not found.', 404));
    }

    // Get recent activity summary
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const summary = {
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        joinDate: user.createdAt,
        lastActive: user.lastActive,
        currentStreak: user.streakCount,
        hasEmergencyContact: !!user.emergencyContact?.name,
      },
      activity: {
        moodEntries: await MoodEntry.countDocuments({ 
          user: userId,
          createdAt: { $gte: thirtyDaysAgo },
        }),
        avgMoodScore: await MoodEntry.aggregate([
          { $match: { user: user._id, createdAt: { $gte: thirtyDaysAgo } } },
          { $group: { _id: null, avg: { $avg: '$moodScore' } } },
        ]).then(r => r[0]?.avg?.toFixed(1) || 'N/A'),
        journalEntries: await JournalEntry.countDocuments({
          user: userId,
          createdAt: { $gte: thirtyDaysAgo },
        }),
        chatSessions: await ChatSession.countDocuments({
          user: userId,
          createdAt: { $gte: thirtyDaysAgo },
        }),
        screenings: await ScreeningResult.countDocuments({
          user: userId,
          createdAt: { $gte: thirtyDaysAgo },
        }),
        appointments: await Appointment.countDocuments({
          student: userId,
          createdAt: { $gte: thirtyDaysAgo },
        }),
      },
      recentScreenings: await ScreeningResult.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(3)
        .select('testType totalScore maxScore severity createdAt'),
      upcomingAppointments: await Appointment.find({
        student: userId,
        status: 'scheduled',
        scheduledAt: { $gte: new Date() },
      })
        .sort({ scheduledAt: 1 })
        .limit(3)
        .select('scheduledAt type status'),
    };

    res.status(200).json({
      status: 'success',
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Export analytics data (Admin)
 * GET /api/v1/admin/export
 */
exports.exportAnalytics = async (req, res, next) => {
  try {
    const { type, days = 30, format = 'json' } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    let data;

    switch (type) {
      case 'mood':
        data = await MoodEntry.aggregate([
          { $match: { createdAt: { $gte: startDate } } },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              avgMood: { $avg: '$moodScore' },
              avgEnergy: { $avg: '$energyLevel' },
              avgStress: { $avg: '$stressLevel' },
              entries: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]);
        break;

      case 'screening':
        data = await ScreeningResult.aggregate([
          { $match: { createdAt: { $gte: startDate } } },
          {
            $group: {
              _id: {
                date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                testType: '$testType',
              },
              avgScore: { $avg: '$percentageScore' },
              count: { $sum: 1 },
            },
          },
          { $sort: { '_id.date': 1 } },
        ]);
        break;

      case 'engagement':
        data = {
          dailyActive: await User.aggregate([
            { $match: { lastActive: { $gte: startDate } } },
            {
              $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$lastActive' } },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ]),
          newUsers: await User.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
              $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ]),
        };
        break;

      default:
        return next(new AppError('Invalid export type. Use: mood, screening, or engagement', 400));
    }

    if (format === 'csv') {
      // Convert to CSV (simple implementation)
      const flatData = Array.isArray(data) ? data : Object.values(data).flat();
      if (flatData.length === 0) {
        return res.status(200).send('No data available');
      }

      const headers = Object.keys(flatData[0]._id || flatData[0]).join(',');
      const rows = flatData.map(row => {
        const flatRow = row._id ? { ...row._id, ...row } : row;
        delete flatRow._id;
        return Object.values(flatRow).join(',');
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=wellsetu_${type}_export.csv`);
      return res.send([headers, ...rows].join('\n'));
    }

    res.status(200).json({
      status: 'success',
      data: {
        type,
        period: `${days} days`,
        exportedAt: new Date(),
        data,
      },
    });
  } catch (error) {
    next(error);
  }
};
