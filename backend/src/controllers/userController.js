/**
 * User Controller
 * Handles user profile and account management
 */

const User = require('../models/User');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * Filter object to only include allowed fields
 */
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

/**
 * Get user profile
 * GET /api/v1/users/profile
 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatarUrl,
          age: user.age,
          location: user.location,
          college: user.college,
          department: user.department,
          bio: user.bio,
          pronouns: user.pronouns,
          interests: user.interests,
          emergencyContact: user.emergencyContact,
          preferences: user.preferences,
          streak: user.streak,
          joinDate: user.createdAt,
          isEmailVerified: user.isEmailVerified,
          specializations: user.specializations,
          availability: user.availability,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * PATCH /api/v1/users/profile
 */
exports.updateProfile = async (req, res, next) => {
  try {
    // 1) Create error if user tries to update password
    if (req.body.password || req.body.passwordConfirm) {
      return next(new AppError('This route is not for password updates. Please use /update-password.', 400));
    }

    // 2) Filter out fields that shouldn't be updated
    const allowedFields = [
      'firstName', 'lastName', 'age', 'location', 'college',
      'department', 'bio', 'pronouns', 'interests', 'avatar',
      'emergencyContact', 'preferences',
    ];
    const filteredBody = filterObj(req.body, ...allowedFields);

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
      new: true,
      runValidators: true,
    });

    logger.info(`Profile updated for user: ${updatedUser.email}`);

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          avatar: updatedUser.avatarUrl,
          age: updatedUser.age,
          location: updatedUser.location,
          college: updatedUser.college,
          department: updatedUser.department,
          bio: updatedUser.bio,
          pronouns: updatedUser.pronouns,
          interests: updatedUser.interests,
          emergencyContact: updatedUser.emergencyContact,
          preferences: updatedUser.preferences,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user preferences
 * PATCH /api/v1/users/preferences
 */
exports.updatePreferences = async (req, res, next) => {
  try {
    const { notifications, language, theme } = req.body;

    const updateData = {};
    if (notifications) updateData['preferences.notifications'] = notifications;
    if (language) updateData['preferences.language'] = language;
    if (theme) updateData['preferences.theme'] = theme;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: {
        preferences: updatedUser.preferences,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deactivate user account
 * DELETE /api/v1/users/deactivate
 */
exports.deactivateAccount = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isActive: false });

    logger.info(`Account deactivated for user: ${req.user.email}`);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID (Admin/Counselor)
 * GET /api/v1/users/:id
 */
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new AppError('No user found with that ID.', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatarUrl,
          age: user.age,
          location: user.location,
          college: user.college,
          department: user.department,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all users (Admin)
 * GET /api/v1/users
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      search,
      isActive,
      sort = '-createdAt',
    } = req.query;

    // Build query
    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Execute query with pagination
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-password');

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users: users.map((user) => ({
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatarUrl,
          isActive: user.isActive,
          createdAt: user.createdAt,
        })),
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
 * Update user role (Admin)
 * PATCH /api/v1/users/:id/role
 */
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['student', 'counselor', 'admin'].includes(role)) {
      return next(new AppError('Invalid role.', 400));
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new AppError('No user found with that ID.', 404));
    }

    logger.info(`User role updated: ${user.email} -> ${role}`);

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get counselors list
 * GET /api/v1/users/counselors
 */
exports.getCounselors = async (req, res, next) => {
  try {
    const counselors = await User.find({
      role: 'counselor',
      isActive: true,
    }).select('firstName lastName avatar specializations availability');

    res.status(200).json({
      status: 'success',
      results: counselors.length,
      data: {
        counselors: counselors.map((c) => ({
          id: c._id,
          name: c.name,
          avatar: c.avatarUrl,
          specializations: c.specializations,
          availability: c.availability,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update streak
 * POST /api/v1/users/streak
 */
exports.updateStreak = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const now = new Date();
    const lastActivity = user.streak.lastActivity;
    
    // Check if activity is on a new day
    const lastDate = new Date(lastActivity);
    const isNewDay = 
      now.getDate() !== lastDate.getDate() ||
      now.getMonth() !== lastDate.getMonth() ||
      now.getFullYear() !== lastDate.getFullYear();

    if (isNewDay) {
      // Check if streak continues (activity within last 48 hours)
      const hoursDiff = (now - lastActivity) / (1000 * 60 * 60);
      
      if (hoursDiff <= 48) {
        user.streak.current += 1;
        if (user.streak.current > user.streak.longest) {
          user.streak.longest = user.streak.current;
        }
      } else {
        user.streak.current = 1;
      }
    }

    user.streak.lastActivity = now;
    await user.save();

    res.status(200).json({
      status: 'success',
      data: {
        streak: user.streak,
      },
    });
  } catch (error) {
    next(error);
  }
};
