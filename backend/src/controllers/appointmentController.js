/**
 * Appointment Controller
 * Handles appointment scheduling and management
 */

const Appointment = require('../models/Appointment');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * Create appointment
 * POST /api/v1/appointments
 */
exports.createAppointment = async (req, res, next) => {
  try {
    const {
      title,
      description,
      type,
      date,
      startTime,
      endTime,
      duration,
      location,
      counselorId,
      providerName,
      phone,
      userNotes,
      reminderTime,
      category,
      priority,
    } = req.body;

    // Validate date is in the future
    const appointmentDate = new Date(date);
    if (appointmentDate < new Date()) {
      return next(new AppError('Appointment date must be in the future.', 400));
    }

    // Check counselor availability if counselor is specified
    if (counselorId) {
      const bookedSlots = await Appointment.getCounselorAvailability(counselorId, date);
      const conflict = bookedSlots.some(slot => {
        return (startTime >= slot.startTime && startTime < slot.endTime) ||
               (endTime > slot.startTime && endTime <= slot.endTime);
      });
      
      if (conflict) {
        return next(new AppError('The counselor is not available at this time.', 400));
      }
    }

    const appointment = await Appointment.create({
      user: req.user._id,
      counselor: counselorId,
      providerName,
      title,
      description,
      type,
      date: appointmentDate,
      startTime,
      endTime,
      duration,
      location,
      phone,
      userNotes,
      reminderTime,
      category,
      priority,
    });

    // Populate counselor details
    await appointment.populate('counselor', 'firstName lastName avatar');

    logger.info(`New appointment created by user ${req.user._id}`);

    res.status(201).json({
      status: 'success',
      data: {
        appointment,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's appointments
 * GET /api/v1/appointments
 */
exports.getAppointments = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      type,
      startDate,
      endDate,
      upcoming,
      sort = '-date',
    } = req.query;

    const query = { user: req.user._id };

    if (status) query.status = status;
    if (type) query.type = type;
    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
      query.status = { $in: ['scheduled', 'confirmed'] };
    }
    if (startDate || endDate) {
      query.date = query.date || {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const total = await Appointment.countDocuments(query);
    const appointments = await Appointment.find(query)
      .populate('counselor', 'firstName lastName avatar specializations')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      results: appointments.length,
      data: {
        appointments,
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
 * Get single appointment
 * GET /api/v1/appointments/:id
 */
exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      $or: [
        { user: req.user._id },
        { counselor: req.user._id },
      ],
    }).populate('counselor', 'firstName lastName avatar email specializations');

    if (!appointment) {
      return next(new AppError('No appointment found with that ID.', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        appointment,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update appointment
 * PATCH /api/v1/appointments/:id
 */
exports.updateAppointment = async (req, res, next) => {
  try {
    // Don't allow updating certain fields
    const { user, counselor, ...updateData } = req.body;

    const appointment = await Appointment.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
        status: { $nin: ['completed', 'cancelled'] },
      },
      updateData,
      { new: true, runValidators: true }
    ).populate('counselor', 'firstName lastName avatar');

    if (!appointment) {
      return next(new AppError('No appointment found or cannot be updated.', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        appointment,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel appointment
 * PATCH /api/v1/appointments/:id/cancel
 */
exports.cancelAppointment = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const appointment = await Appointment.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [{ user: req.user._id }, { counselor: req.user._id }],
        status: { $in: ['scheduled', 'confirmed'] },
      },
      {
        status: 'cancelled',
        cancellationReason: reason,
        cancelledBy: req.user._id,
        cancelledAt: new Date(),
      },
      { new: true }
    );

    if (!appointment) {
      return next(new AppError('No appointment found or cannot be cancelled.', 404));
    }

    logger.info(`Appointment ${appointment._id} cancelled by user ${req.user._id}`);

    res.status(200).json({
      status: 'success',
      data: {
        appointment,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark appointment as completed
 * PATCH /api/v1/appointments/:id/complete
 */
exports.completeAppointment = async (req, res, next) => {
  try {
    const { counselorNotes } = req.body;

    const appointment = await Appointment.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [{ user: req.user._id }, { counselor: req.user._id }],
        status: { $in: ['scheduled', 'confirmed'] },
      },
      {
        status: 'completed',
        ...(counselorNotes && { counselorNotes }),
      },
      { new: true }
    );

    if (!appointment) {
      return next(new AppError('No appointment found or cannot be completed.', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        appointment,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit feedback for appointment
 * POST /api/v1/appointments/:id/feedback
 */
exports.submitFeedback = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return next(new AppError('Rating must be between 1 and 5.', 400));
    }

    const appointment = await Appointment.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
        status: 'completed',
      },
      {
        feedback: {
          rating,
          comment,
          submittedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!appointment) {
      return next(new AppError('No completed appointment found.', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        feedback: appointment.feedback,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get upcoming appointments
 * GET /api/v1/appointments/upcoming
 */
exports.getUpcoming = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;
    const appointments = await Appointment.getUpcoming(req.user._id, parseInt(limit));

    res.status(200).json({
      status: 'success',
      results: appointments.length,
      data: {
        appointments,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get available time slots for a counselor
 * GET /api/v1/appointments/availability/:counselorId
 */
exports.getCounselorAvailability = async (req, res, next) => {
  try {
    const { counselorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return next(new AppError('Date is required.', 400));
    }

    // Get counselor's general availability
    const counselor = await User.findById(counselorId);
    if (!counselor || counselor.role !== 'counselor') {
      return next(new AppError('Counselor not found.', 404));
    }

    // Get booked slots
    const bookedSlots = await Appointment.getCounselorAvailability(counselorId, date);

    // Generate available slots (9 AM to 5 PM, 1-hour slots)
    const availableSlots = [];
    const dayOfWeek = new Date(date).getDay();
    const counselorAvailability = counselor.availability?.find(a => a.dayOfWeek === dayOfWeek);

    if (counselorAvailability) {
      const { startTime = '09:00', endTime = '17:00' } = counselorAvailability;
      const [startHour] = startTime.split(':').map(Number);
      const [endHour] = endTime.split(':').map(Number);

      for (let hour = startHour; hour < endHour; hour++) {
        const slotStart = `${String(hour).padStart(2, '0')}:00`;
        const slotEnd = `${String(hour + 1).padStart(2, '0')}:00`;
        
        const isBooked = bookedSlots.some(slot => 
          (slotStart >= slot.startTime && slotStart < slot.endTime) ||
          (slotEnd > slot.startTime && slotEnd <= slot.endTime)
        );

        availableSlots.push({
          startTime: slotStart,
          endTime: slotEnd,
          available: !isBooked,
        });
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        counselor: {
          id: counselor._id,
          name: counselor.name,
        },
        date,
        slots: availableSlots,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get counselor's appointments (Counselor only)
 * GET /api/v1/appointments/counselor
 */
exports.getCounselorAppointments = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, date, sort = 'date' } = req.query;

    const query = { counselor: req.user._id };
    if (status) query.status = status;
    if (date) {
      const queryDate = new Date(date);
      queryDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(queryDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = { $gte: queryDate, $lt: nextDay };
    }

    const total = await Appointment.countDocuments(query);
    const appointments = await Appointment.find(query)
      .populate('user', 'firstName lastName avatar email')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      results: appointments.length,
      data: {
        appointments,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
