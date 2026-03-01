/**
 * Routes Index
 * Exports all route modules
 */

module.exports = {
  authRoutes: require('./authRoutes'),
  userRoutes: require('./userRoutes'),
  moodRoutes: require('./moodRoutes'),
  journalRoutes: require('./journalRoutes'),
  appointmentRoutes: require('./appointmentRoutes'),
  screeningRoutes: require('./screeningRoutes'),
  forumRoutes: require('./forumRoutes'),
  chatRoutes: require('./chatRoutes'),
  resourceRoutes: require('./resourceRoutes'),
  adminRoutes: require('./adminRoutes'),
};
