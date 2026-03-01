/**
 * Model Index File
 * Exports all database models
 */

const User = require('./User');
const MoodEntry = require('./MoodEntry');
const JournalEntry = require('./JournalEntry');
const Appointment = require('./Appointment');
const ScreeningResult = require('./ScreeningResult');
const ForumPost = require('./ForumPost');
const ChatSession = require('./ChatSession');
const Resource = require('./Resource');

module.exports = {
  User,
  MoodEntry,
  JournalEntry,
  Appointment,
  ScreeningResult,
  ForumPost,
  ChatSession,
  Resource,
};
