/**
 * Authentication Middleware
 * JWT verification and role-based access control
 */

const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * Generate JWT token
 */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Generate refresh token
 */
const signRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });
};

/**
 * Create and send token response
 */
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  // Cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    sameSite: 'lax',
  };

  // Set cookies
  res.cookie('jwt', token, cookieOptions);
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });

  // Remove password from output
  user.password = undefined;

  // Construct user response object
  const userResponse = {
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
    joinDate: user.createdAt,
    preferences: user.preferences,
    isEmailVerified: user.isEmailVerified,
  };

  res.status(statusCode).json({
    status: 'success',
    token,
    refreshToken,
    data: {
      user: userResponse,
    },
  });
};

/**
 * Protect routes - verify JWT token
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // 1) Get token from header or cookie
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    // 2) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // 4) Check if user is active
    if (!currentUser.isActive) {
      return next(new AppError('Your account has been deactivated. Please contact support.', 401));
    }

    // 5) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(new AppError('User recently changed password. Please log in again.', 401));
    }

    // 6) Check if account is locked
    if (currentUser.isLocked()) {
      return next(new AppError('Your account is temporarily locked. Please try again later.', 423));
    }

    // Grant access to protected route
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token. Please log in again.', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Your token has expired. Please log in again.', 401));
    }
    next(error);
  }
};

/**
 * Optional authentication - attach user if logged in but don't require it
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (token) {
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
      const currentUser = await User.findById(decoded.id);
      
      if (currentUser && currentUser.isActive && !currentUser.changedPasswordAfter(decoded.iat)) {
        req.user = currentUser;
        res.locals.user = currentUser;
      }
    }

    next();
  } catch (error) {
    // Silently continue without authentication
    next();
  }
};

/**
 * Restrict access to specific roles
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};

/**
 * Check ownership or admin/counselor access
 */
const checkOwnershipOrRole = (resourceUserField = 'user', allowedRoles = ['admin', 'counselor']) => {
  return (req, res, next) => {
    // Allow admins and counselors full access
    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    // Check if the resource belongs to the user
    const resourceUserId = req.resource?.[resourceUserField];
    if (resourceUserId && resourceUserId.toString() === req.user._id.toString()) {
      return next();
    }

    return next(new AppError('You do not have permission to access this resource.', 403));
  };
};

/**
 * Refresh access token using refresh token
 */
const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new AppError('Refresh token is required.', 400));
    }

    // Verify refresh token
    const decoded = await promisify(jwt.verify)(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Get user
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return next(new AppError('Invalid refresh token.', 401));
    }

    // Generate new tokens
    createSendToken(user, 200, req, res);
  } catch (error) {
    return next(new AppError('Invalid or expired refresh token.', 401));
  }
};

module.exports = {
  signToken,
  signRefreshToken,
  createSendToken,
  protect,
  optionalAuth,
  restrictTo,
  checkOwnershipOrRole,
  refreshAccessToken,
};
