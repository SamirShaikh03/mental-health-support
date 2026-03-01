import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendar, 
  faPlus, 
  faEdit, 
  faTrash,
  faCheck,
  faTimes,
  faUserMd,
  faClock,
  faMapMarkerAlt,
  faPhone,
  faVideo,
  faFilter,
  faSearch,
  faExclamationTriangle,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import Calendar from 'react-calendar';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns';

export default function Appointments({ user }) {
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [newAppointment, setNewAppointment] = useState({
    title: '',
    provider: '',
    date: '',
    time: '',
    type: 'in-person',
    location: '',
    phone: '',
    notes: '',
    reminderTime: '15'
  });
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const appointmentTypes = [
    { value: 'in-person', label: t('appointments.types.inPerson'), icon: faUserMd },
    { value: 'video', label: t('appointments.types.videoCall'), icon: faVideo },
    { value: 'phone', label: t('appointments.types.phoneCall'), icon: faPhone }
  ];

  const commonProviders = [
    'Dr. Sarah Johnson - Psychiatrist',
    'Dr. Michael Chen - Therapist',
    'Dr. Emily Rodriguez - Counselor',
    'Dr. David Kim - Psychologist',
    'Dr. Lisa Thompson - Social Worker'
  ];

  useEffect(() => {
    // Load appointments (mock data)
    const mockAppointments = generateMockAppointments();
    setAppointments(mockAppointments);
  }, []);

  const generateMockAppointments = () => {
    const appointments = [];
    const today = new Date();
    
    // Past appointment
    appointments.push({
      id: 1,
      title: 'Therapy Session',
      provider: 'Dr. Sarah Johnson - Therapist',
      date: format(addDays(today, -2), 'yyyy-MM-dd'),
      time: '14:00',
      type: 'video',
      location: 'Online',
      phone: '+1-555-0123',
      notes: 'Weekly therapy session to discuss anxiety management.',
      status: 'completed',
      reminderTime: '15'
    });

    // Today's appointment
    appointments.push({
      id: 2,
      title: 'Check-up with Psychiatrist',
      provider: 'Dr. Michael Chen - Psychiatrist',
      date: format(today, 'yyyy-MM-dd'),
      time: '10:30',
      type: 'in-person',
      location: '123 Mental Health St, Suite 456',
      phone: '+1-555-0456',
      notes: 'Medication review and adjustment.',
      status: 'scheduled',
      reminderTime: '30'
    });

    // Future appointments
    appointments.push({
      id: 3,
      title: 'Group Therapy',
      provider: 'Dr. Emily Rodriguez - Counselor',
      date: format(addDays(today, 3), 'yyyy-MM-dd'),
      time: '18:00',
      type: 'in-person',
      location: 'Community Center Room 201',
      phone: '+1-555-0789',
      notes: 'Weekly group therapy for anxiety support.',
      status: 'scheduled',
      reminderTime: '60'
    });

    appointments.push({
      id: 4,
      title: 'Follow-up Session',
      provider: 'Dr. Sarah Johnson - Therapist',
      date: format(addDays(today, 7), 'yyyy-MM-dd'),
      time: '15:30',
      type: 'video',
      location: 'Online',
      phone: '+1-555-0123',
      notes: 'Follow-up on coping strategies discussed last session.',
      status: 'scheduled',
      reminderTime: '15'
    });

    return appointments;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const appointmentData = {
      ...newAppointment,
      id: editingAppointment ? editingAppointment.id : Date.now(),
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    if (editingAppointment) {
      setAppointments(prev => prev.map(apt => 
        apt.id === editingAppointment.id ? appointmentData : apt
      ));
    } else {
      setAppointments(prev => [appointmentData, ...prev]);
    }

    resetForm();
  };

  const resetForm = () => {
    setNewAppointment({
      title: '',
      provider: '',
      date: '',
      time: '',
      type: 'in-person',
      location: '',
      phone: '',
      notes: '',
      reminderTime: '15'
    });
    setShowAddForm(false);
    setEditingAppointment(null);
  };

  const editAppointment = (appointment) => {
    setNewAppointment(appointment);
    setEditingAppointment(appointment);
    setShowAddForm(true);
  };

  const deleteAppointment = (appointmentId) => {
    if (window.confirm(t('appointments.cancelConfirm'))) {
      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
    }
  };

  const markAsCompleted = (appointmentId) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId ? { ...apt, status: 'completed' } : apt
    ));
  };

  const markAsMissed = (appointmentId) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId ? { ...apt, status: 'missed' } : apt
    ));
  };

  const getAppointmentsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return appointments.filter(apt => apt.date === dateStr);
  };

  const getUpcomingAppointments = () => {
    const today = new Date();
    return appointments
      .filter(apt => new Date(apt.date) >= today && apt.status === 'scheduled')
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesType = filterType === 'all' || apt.type === filterType;
    const matchesSearch = apt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.provider.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const upcomingAppointments = getUpcomingAppointments();
  const appointmentsForSelectedDate = getAppointmentsForDate(selectedDate);
  const nextAppointment = upcomingAppointments[0];
  const reminderCopy = {
    '0': 'No reminder scheduled',
    '15': 'Reminder set • 15 minutes before',
    '30': 'Reminder set • 30 minutes before',
    '60': 'Reminder set • 1 hour before',
    '120': 'Reminder set • 2 hours before',
    '1440': 'Reminder set • 1 day before'
  };

  const getReminderDescription = (value) => reminderCopy[value] || `Reminder set • ${value} minutes before`;

  const scheduledCount = appointments.filter(apt => apt.status === 'scheduled').length;
  const completedCount = appointments.filter(apt => apt.status === 'completed').length;
  const missedCount = appointments.filter(apt => apt.status === 'missed').length;
  const uniqueProviders = [...new Set(appointments.map(apt => apt.provider))];
  const focusAppointments = upcomingAppointments.slice(0, 2);
  const reminderDescription = nextAppointment
    ? getReminderDescription(nextAppointment.reminderTime)
    : 'Add reminders so we can nudge you ahead of each session.';
  const providerPreview = uniqueProviders.slice(0, 3);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#4caf50';
      case 'missed': return '#f44336';
      case 'cancelled': return '#ff9800';
      default: return '#2196f3';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return faCheckCircle;
      case 'missed': return faExclamationTriangle;
      case 'cancelled': return faTimes;
      default: return faClock;
    }
  };

  const formatAppointmentDate = (dateStr) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d, yyyy');
  };

  const getTypeIcon = (type) => {
    const typeObj = appointmentTypes.find(t => t.value === type);
    return typeObj ? typeObj.icon : faUserMd;
  };

  if (!user) {
    return (
      <div className="appointments-page">
        <div className="container">
          <div className="auth-required">
            <FontAwesomeIcon icon={faCalendar} size="3x" />
            <h2>{t('appointments.loginRequired')}</h2>
            <p>{t('appointments.loginDescription')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="appointments-page">
      <div className="container">
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-top">
            <div className="header-copy">
              <p className="header-eyebrow">{t('appointments.carePlanner')}</p>
              <h1>
                <FontAwesomeIcon icon={faCalendar} className="header-icon" />
                {t('appointments.pageTitle')}
              </h1>
              <p>{t('appointments.pageDescription')}</p>
            </div>

            <motion.button 
              className="btn btn-primary"
              onClick={() => setShowAddForm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FontAwesomeIcon icon={faPlus} />
              {t('appointments.newAppointment')}
            </motion.button>
          </div>

          <div className="header-metrics">
            <div className="metric-card">
              <FontAwesomeIcon icon={faClock} />
              <div>
                <span>{t('appointments.nextSession')}</span>
                <strong>{nextAppointment ? `${formatAppointmentDate(nextAppointment.date)} • ${nextAppointment.time}` : t('appointments.noUpcoming')}</strong>
              </div>
            </div>
            <div className="metric-card">
              <FontAwesomeIcon icon={faCheckCircle} />
              <div>
                <span>{t('appointments.completedLabel')}</span>
                <strong>{completedCount}</strong>
              </div>
            </div>
            <div className="metric-card">
              <FontAwesomeIcon icon={faUserMd} />
              <div>
                <span>{t('appointments.careTeam')}</span>
                <strong>{uniqueProviders.length || 0} {uniqueProviders.length === 1 ? t('appointments.provider') : t('appointments.providers')}</strong>
                {providerPreview.length > 0 && (
                  <p className="metric-subtext">{providerPreview.join(' • ')}</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Overview */}
        <motion.section 
          className="appointments-overview"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="overview-cards">
            <div className="overview-card snapshot-card">
              <div className="snapshot-header">
                <h3>{t('appointments.nextSession')}</h3>
                {nextAppointment && (
                  <span className="snapshot-pill">
                    {appointmentTypes.find(t => t.value === nextAppointment.type)?.label}
                  </span>
                )}
              </div>
              {nextAppointment ? (
                <>
                  <p className="snapshot-eyebrow">{formatAppointmentDate(nextAppointment.date)} • {nextAppointment.time}</p>
                  <h4 className="snapshot-title">{nextAppointment.title}</h4>
                  <p className="snapshot-subtext">{nextAppointment.provider}</p>
                  <div className="snapshot-meta">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span>{nextAppointment.location || 'Location shared upon confirmation'}</span>
                  </div>
                </>
              ) : (
                <p className="snapshot-empty">{t('appointments.noUpcoming')}</p>
              )}
            </div>

            <div className="overview-card snapshot-card">
              <h3>{t('appointments.overview.progressSnapshot')}</h3>
              <div className="snapshot-stat-grid">
                <div>
                  <span>{t('appointments.overview.scheduled')}</span>
                  <strong>{scheduledCount}</strong>
                </div>
                <div>
                  <span>{t('appointments.completedLabel')}</span>
                  <strong>{completedCount}</strong>
                </div>
                <div>
                  <span>{t('appointments.overview.missed')}</span>
                  <strong>{missedCount}</strong>
                </div>
              </div>
              <p className="snapshot-subtext">{t('appointments.overview.monthView')}</p>
            </div>

            <div className="overview-card snapshot-card">
              <h3>{t('appointments.reminders.title')}</h3>
              <p className="snapshot-eyebrow">{reminderDescription}</p>
              <ul className="snapshot-list">
                {focusAppointments.length > 0 ? (
                  focusAppointments.map(apt => (
                    <li key={apt.id}>
                      <strong>{formatAppointmentDate(apt.date)}</strong>
                      <span>{apt.title}</span>
                    </li>
                  ))
                ) : (
                  <li>{t('appointments.reminders.noReminders')}</li>
                )}
              </ul>
            </div>
          </div>
        </motion.section>

        <div className="appointments-content">
          {/* Calendar Section */}
          <motion.section 
            className="calendar-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2>{t('appointments.calendar.title')}</h2>
            <div className="calendar-container">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={({ date, view }) => {
                  if (view === 'month') {
                    const dayAppointments = getAppointmentsForDate(date);
                    if (dayAppointments.length > 0) {
                      return (
                        <div className="calendar-appointments">
                          {dayAppointments.slice(0, 2).map(apt => (
                            <div 
                              key={apt.id} 
                              className="calendar-apt-dot"
                              style={{ backgroundColor: getStatusColor(apt.status) }}
                            />
                          ))}
                          {dayAppointments.length > 2 && (
                            <span className="apt-count">+{dayAppointments.length - 2}</span>
                          )}
                        </div>
                      );
                    }
                  }
                  return null;
                }}
              />
            </div>

            {/* Selected Date Appointments */}
            <div className="selected-date-appointments">
              <h3>
                {formatAppointmentDate(format(selectedDate, 'yyyy-MM-dd'))} {t('appointments.calendar.appointments')}
              </h3>
              <div className="date-appointments-list">
                {appointmentsForSelectedDate.length > 0 ? (
                  appointmentsForSelectedDate.map(apt => (
                    <div key={apt.id} className="date-appointment-item">
                      <div className="apt-time">{apt.time}</div>
                      <div className="apt-info">
                        <h4>{apt.title}</h4>
                        <p>{apt.provider}</p>
                      </div>
                      <div 
                        className="apt-status"
                        style={{ color: getStatusColor(apt.status) }}
                      >
                        <FontAwesomeIcon icon={getStatusIcon(apt.status)} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-appointments">{t('appointments.calendar.noAppointments')}</p>
                )}
              </div>
            </div>
          </motion.section>

          {/* Appointments List */}
          <motion.section 
            className="appointments-list-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="list-header">
              <h2>{t('appointments.list.title')}</h2>
              
              <div className="list-filters">
                <div className="search-filter">
                  <FontAwesomeIcon icon={faSearch} />
                  <input
                    type="text"
                    placeholder={t('appointments.list.search')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="type-filter"
                >
                  <option value="all">{t('appointments.list.allTypes')}</option>
                  {appointmentTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="appointments-grid">
              {filteredAppointments.map((appointment, index) => (
                <motion.div
                  key={appointment.id}
                  className="appointment-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  whileHover={{ y: -2 }}
                >
                  <div className="appointment-header">
                    <div className="apt-main-info">
                      <h3>{appointment.title}</h3>
                      <p className="apt-provider">{appointment.provider}</p>
                    </div>
                    
                    <div 
                      className="apt-status-badge"
                      style={{ backgroundColor: getStatusColor(appointment.status) }}
                    >
                      <FontAwesomeIcon icon={getStatusIcon(appointment.status)} />
                      <span>{appointment.status}</span>
                    </div>
                  </div>

                  <div className="appointment-details">
                    <div className="apt-datetime">
                      <FontAwesomeIcon icon={faCalendar} />
                      <span>{formatAppointmentDate(appointment.date)} at {appointment.time}</span>
                    </div>
                    
                    <div className="apt-type">
                      <FontAwesomeIcon icon={getTypeIcon(appointment.type)} />
                      <span>{appointmentTypes.find(t => t.value === appointment.type)?.label}</span>
                    </div>
                    
                    {appointment.location && (
                      <div className="apt-location">
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                        <span>{appointment.location}</span>
                      </div>
                    )}
                    
                    {appointment.notes && (
                      <div className="apt-notes">
                        <p>"{appointment.notes}"</p>
                      </div>
                    )}
                  </div>

                  <div className="appointment-actions">
                    {appointment.status === 'scheduled' && (
                      <>
                        <button
                          className="appointment-chip is-positive"
                          onClick={() => markAsCompleted(appointment.id)}
                        >
                          <FontAwesomeIcon icon={faCheck} />
                          <span>{t('appointments.actions.markDone')}</span>
                        </button>
                        <button
                          className="appointment-chip is-neutral"
                          onClick={() => markAsMissed(appointment.id)}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                          <span>{t('appointments.actions.markMissed')}</span>
                        </button>
                      </>
                    )}

                    <button
                      className="appointment-chip"
                      onClick={() => editAppointment(appointment)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                      <span>{t('appointments.actions.edit')}</span>
                    </button>

                    <button
                      className="appointment-chip is-danger"
                      onClick={() => deleteAppointment(appointment.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      <span>{t('appointments.actions.delete')}</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Add/Edit Appointment Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div 
              className="appointment-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => resetForm()}
            >
              <motion.div 
                className="modal-content"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>{editingAppointment ? t('appointments.modal.editTitle') : t('appointments.modal.newTitle')}</h2>
                  <button 
                    className="close-modal"
                    onClick={resetForm}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="appointment-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="title">{t('appointments.modal.title')} *</label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={newAppointment.title}
                        onChange={handleInputChange}
                        placeholder={t('appointments.modal.titlePlaceholder')}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="provider">{t('appointments.modal.counselor')} *</label>
                      <input
                        type="text"
                        id="provider"
                        name="provider"
                        value={newAppointment.provider}
                        onChange={handleInputChange}
                        placeholder={t('appointments.modal.counselorPlaceholder')}
                        list="providers"
                        required
                      />
                      <datalist id="providers">
                        {commonProviders.map(provider => (
                          <option key={provider} value={provider} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="date">{t('appointments.modal.date')} *</label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={newAppointment.date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="time">{t('appointments.modal.time')} *</label>
                      <input
                        type="time"
                        id="time"
                        name="time"
                        value={newAppointment.time}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="type">{t('appointments.modal.type')} *</label>
                    <select
                      id="type"
                      name="type"
                      value={newAppointment.type}
                      onChange={handleInputChange}
                      required
                    >
                      {appointmentTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={newAppointment.location}
                      onChange={handleInputChange}
                      placeholder="Address or 'Online' for virtual appointments"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Contact Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={newAppointment.phone}
                      onChange={handleInputChange}
                      placeholder="+1-555-0123"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="notes">{t('appointments.modal.notes')}</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={newAppointment.notes}
                      onChange={handleInputChange}
                      placeholder={t('appointments.modal.notesPlaceholder')}
                      rows={3}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="reminderTime">{t('appointments.modal.reminder')}</label>
                    <select
                      id="reminderTime"
                      name="reminderTime"
                      value={newAppointment.reminderTime}
                      onChange={handleInputChange}
                    >
                      <option value="0">{t('appointments.reminders.options.none')}</option>
                      <option value="15">{t('appointments.reminders.options.min15')}</option>
                      <option value="30">{t('appointments.reminders.options.min30')}</option>
                      <option value="60">{t('appointments.reminders.options.hour1')}</option>
                      <option value="120">2 hours before</option>
                      <option value="1440">{t('appointments.reminders.options.day1')}</option>
                    </select>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="btn btn-outline"
                      onClick={resetForm}
                    >
                      {t('appointments.modal.cancel')}
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                    >
                      {editingAppointment ? t('appointments.modal.update') : t('appointments.modal.schedule')}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
