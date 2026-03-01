/**
 * Authentication Controller
 * Handles user registration, login, password management
 */

const crypto = require('crypto');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');
const { createSendToken, signToken } = require('../middleware/auth');

/**
 * Register a new user
 * POST /api/v1/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      age,
      location,
      emergencyContact,
      emergencyPhone,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('A user with this email already exists.', 400));
    }

    // Create new user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      age,
      location,
      emergencyContact: emergencyContact ? {
        name: emergencyContact,
        phone: emergencyPhone,
      } : undefined,
    });

    logger.info(`New user registered: ${email}`);

    // Send token and user data
    createSendToken(newUser, 201, req, res);
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /api/v1/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password.', 400));
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new AppError('Incorrect email or password.', 401));
    }

    // 3) Check if account is locked
    if (user.isLocked()) {
      return next(new AppError('Your account is temporarily locked due to too many failed login attempts. Please try again later.', 423));
    }

    // 4) Verify password
    const isPasswordCorrect = await user.correctPassword(password, user.password);

    if (!isPasswordCorrect) {
      // Increment login attempts
      await user.incLoginAttempts();
      return next(new AppError('Incorrect email or password.', 401));
    }

    // 5) Check if user is active
    if (!user.isActive) {
      return next(new AppError('Your account has been deactivated. Please contact support.', 401));
    }

    // 6) Verify role if provided
    if (role && user.role !== role) {
      return next(new AppError(`You don't have access as ${role}. Your role is ${user.role}.`, 403));
    }

    // 7) Reset login attempts and update last login
    await User.resetLoginAttempts(user._id);
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    logger.info(`User logged in: ${email}`);

    // 8) Send token and user data
    createSendToken(user, 200, req, res);
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 * POST /api/v1/auth/logout
 */
exports.logout = (req, res) => {
  // Clear cookies
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.cookie('refreshToken', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'Successfully logged out',
  });
};

/**
 * Get current user
 * GET /api/v1/auth/me
 */
exports.getMe = async (req, res, next) => {
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
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update password
 * PATCH /api/v1/auth/update-password
 */
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // 1) Get user
    const user = await User.findById(req.user._id).select('+password');

    // 2) Check if current password is correct
    if (!(await user.correctPassword(currentPassword, user.password))) {
      return next(new AppError('Your current password is incorrect.', 401));
    }

    // 3) Update password
    user.password = newPassword;
    await user.save();

    logger.info(`Password updated for user: ${user.email}`);

    // 4) Log user in with new password
    createSendToken(user, 200, req, res);
  } catch (error) {
    next(error);
  }
};

/**
 * Forgot password
 * POST /api/v1/auth/forgot-password
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // 1) Get user
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists
      return res.status(200).json({
        status: 'success',
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    }

    // 2) Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // 3) In production, send email with reset link
    // For now, just log it
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    logger.info(`Password reset requested for ${email}. Reset URL: ${resetURL}`);

    // TODO: Send email with reset link
    // await sendEmail({ email, subject: 'Password Reset', resetURL });

    res.status(200).json({
      status: 'success',
      message: 'If an account with that email exists, a password reset link has been sent.',
      // Only include token in development
      ...(process.env.NODE_ENV === 'development' && { resetToken }),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password
 * PATCH /api/v1/auth/reset-password/:token
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // 1) Get user based on token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // 2) Check if token is valid
    if (!user) {
      return next(new AppError('Token is invalid or has expired.', 400));
    }

    // 3) Set new password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    logger.info(`Password reset successful for user: ${user.email}`);

    // 4) Log user in
    createSendToken(user, 200, req, res);
  } catch (error) {
    next(error);
  }
};

/**
 * Verify email
 * GET /api/v1/auth/verify-email/:token
 */
exports.verifyEmail = async (req, res, next) => {
  try {
    // In production, implement email verification token logic
    res.status(200).json({
      status: 'success',
      message: 'Email verification feature coming soon.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Check if email is available
 * GET /api/v1/auth/check-email
 */
exports.checkEmail = async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      return next(new AppError('Email is required.', 400));
    }

    const existingUser = await User.findOne({ email });

    res.status(200).json({
      status: 'success',
      data: {
        available: !existingUser,
      },
    });
  } catch (error) {
    next(error);
  }
};
