/**
 * Appointment Model
 * Manages counseling appointments and scheduling
 */

const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    // Student/Patient
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Appointment must have a user'],
      index: true,
    },
    // Counselor/Provider
    counselor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    // If no counselor assigned, use provider name
    providerName: {
      type: String,
      trim: true,
      maxlength: [200, 'Provider name cannot exceed 200 characters'],
    },
    title: {
      type: String,
      required: [true, 'Appointment title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    // Appointment type
    type: {
      type: String,
      required: [true, 'Appointment type is required'],
      enum: ['in-person', 'video', 'phone', 'chat'],
      default: 'video',
    },
    // Date and time
    date: {
      type: Date,
      required: [true, 'Appointment date is required'],
      index: true,
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
    },
    duration: {
      type: Number,
      default: 60, // Duration in minutes
      min: [15, 'Minimum duration is 15 minutes'],
      max: [180, 'Maximum duration is 3 hours'],
    },
    // Location details
    location: {
      type: String,
      trim: true,
      maxlength: [500, 'Location cannot exceed 500 characters'],
    },
    // For video/phone appointments
    meetingLink: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    // Status
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'missed', 'rescheduled'],
      default: 'scheduled',
      index: true,
    },
    // Cancellation reason
    cancellationReason: {
      type: String,
      trim: true,
      maxlength: [500, 'Cancellation reason cannot exceed 500 characters'],
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    cancelledAt: Date,
    // Rescheduling
    rescheduledFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    rescheduledTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    // Reminder settings
    reminderTime: {
      type: Number,
      default: 30, // Minutes before appointment
      enum: [0, 15, 30, 60, 120, 1440], // 0, 15min, 30min, 1hr, 2hr, 1day
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    // Notes
    userNotes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
    // Counselor's private notes (only visible to counselors)
    counselorNotes: {
      type: String,
      trim: true,
      maxlength: [5000, 'Counselor notes cannot exceed 5000 characters'],
    },
    // Session feedback
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        trim: true,
        maxlength: [1000, 'Feedback cannot exceed 1000 characters'],
      },
      submittedAt: Date,
    },
    // Priority/urgency
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal',
    },
    // Category
    category: {
      type: String,
      enum: ['individual_therapy', 'group_therapy', 'crisis_intervention', 'follow_up', 'initial_consultation', 'medication_review', 'other'],
      default: 'individual_therapy',
    },
    // Recurring appointment settings
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringPattern: {
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'biweekly', 'monthly'],
      },
      dayOfWeek: [Number], // 0-6 for Sunday-Saturday
      endDate: Date,
    },
    parentAppointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
appointmentSchema.index({ user: 1, date: 1 });
appointmentSchema.index({ counselor: 1, date: 1 });
appointmentSchema.index({ status: 1, date: 1 });
appointmentSchema.index({ date: 1, reminderSent: 1 });

// Virtual for provider display name
appointmentSchema.virtual('providerDisplayName').get(function() {
  if (this.counselor && this.counselor.name) {
    return this.counselor.name;
  }
  return this.providerName || 'Not Assigned';
});

// Virtual to check if appointment is upcoming
appointmentSchema.virtual('isUpcoming').get(function() {
  return this.date > new Date() && this.status === 'scheduled';
});

// Virtual to check if appointment is today
appointmentSchema.virtual('isToday').get(function() {
  const today = new Date();
  const appointmentDate = new Date(this.date);
  return (
    appointmentDate.getDate() === today.getDate() &&
    appointmentDate.getMonth() === today.getMonth() &&
    appointmentDate.getFullYear() === today.getFullYear()
  );
});

// Pre-save middleware
appointmentSchema.pre('save', function(next) {
  // Calculate end time if not provided
  if (this.startTime && this.duration && !this.endTime) {
    const [hours, minutes] = this.startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + this.duration;
    const endHours = Math.floor(endMinutes / 60) % 24;
    const endMins = endMinutes % 60;
    this.endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
  }
  next();
});

// Static method to get upcoming appointments for a user
appointmentSchema.statics.getUpcoming = async function(userId, limit = 5) {
  return await this.find({
    user: userId,
    date: { $gte: new Date() },
    status: { $in: ['scheduled', 'confirmed'] },
  })
    .sort({ date: 1 })
    .limit(limit)
    .populate('counselor', 'firstName lastName avatar specializations');
};

// Static method to get appointments needing reminders
appointmentSchema.statics.getAppointmentsNeedingReminders = async function() {
  const now = new Date();
  
  return await this.find({
    status: { $in: ['scheduled', 'confirmed'] },
    reminderSent: false,
    date: { $gte: now },
  }).populate('user', 'email firstName preferences');
};

// Static method to get counselor availability
appointmentSchema.statics.getCounselorAvailability = async function(counselorId, date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const bookedSlots = await this.find({
    counselor: counselorId,
    date: { $gte: startOfDay, $lte: endOfDay },
    status: { $nin: ['cancelled', 'missed'] },
  }).select('startTime endTime');

  return bookedSlots;
};

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
