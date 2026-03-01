import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendar, 
  faHeart, 
  faComments, 
  faBook,
  faDumbbell,
  faUser,
  faChartLine,
  faArrowTrendUp,
  faSmile,
  faMeh,
  faFrown,
  faExclamationTriangle,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';

export default function Dashboard({ user }) {
  const { t } = useTranslation();
  const [todayMood, setTodayMood] = useState(null);
  const [weeklyGoals, setWeeklyGoals] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [moodData, setMoodData] = useState([]);
  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = () => {
      // Mock mood data for the last 7 days
      const mockMoodData = [
        { day: 'Mon', mood: 7, anxiety: 3, energy: 6 },
        { day: 'Tue', mood: 6, anxiety: 4, energy: 5 },
        { day: 'Wed', mood: 8, anxiety: 2, energy: 7 },
        { day: 'Thu', mood: 5, anxiety: 6, energy: 4 },
        { day: 'Fri', mood: 7, anxiety: 3, energy: 6 },
        { day: 'Sat', mood: 9, anxiety: 1, energy: 8 },
        { day: 'Sun', mood: 8, anxiety: 2, energy: 7 }
      ];

      const mockGoals = [
        { id: 1, title: t('dashboard.dailyMeditation'), progress: 80, target: 7, completed: 6 },
        { id: 2, title: t('dashboard.moodCheckins'), progress: 100, target: 7, completed: 7 },
        { id: 3, title: t('dashboard.journalEntries'), progress: 60, target: 5, completed: 3 },
        { id: 4, title: t('dashboard.exerciseSessions'), progress: 40, target: 3, completed: 1 }
      ];

      const mockActivity = [
        { 
          id: 1, 
          type: 'mood', 
          title: t('dashboard.moodCheckin'), 
          description: t('dashboard.feelingGood'), 
          time: t('dashboard.hoursAgo', { count: 2 }),
          icon: faHeart 
        },
        { 
          id: 2, 
          type: 'chat', 
          title: t('dashboard.aiTherapySession'), 
          description: t('dashboard.discussedAnxiety'), 
          time: t('dashboard.daysAgo', { count: 1 }),
          icon: faComments 
        },
        { 
          id: 3, 
          type: 'exercise', 
          title: t('dashboard.breathingExercise'), 
          description: t('dashboard.completedBreathing'), 
          time: t('dashboard.daysAgo', { count: 2 }),
          icon: faDumbbell 
        },
        { 
          id: 4, 
          type: 'journal', 
          title: t('dashboard.journalEntry'), 
          description: t('dashboard.reflectedToday'), 
          time: t('dashboard.daysAgo', { count: 3 }),
          icon: faBook 
        }
      ];

      setMoodData(mockMoodData);
      setWeeklyGoals(mockGoals);
      setRecentActivity(mockActivity);
      setTodayMood(8);
      setStreakCount(12);
    };

    loadDashboardData();
  }, []);

  const getMoodIcon = (mood) => {
    if (mood >= 8) return { icon: faSmile, color: '#4CAF50' };
    if (mood >= 6) return { icon: faMeh, color: '#FF9800' };
    return { icon: faFrown, color: '#F44336' };
  };

  const getTodayDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const quickActions = [
    { 
      title: t('dashboard.logMood'), 
      icon: faHeart, 
      link: '/mood-tracker', 
      color: '#e91e63',
      description: t('dashboard.trackFeeling')
    },
    { 
      title: t('dashboard.startChat'), 
      icon: faComments, 
      link: '/chat', 
      color: '#2196f3',
      description: t('dashboard.talkToAI')
    },
    { 
      title: t('dashboard.doExercise'), 
      icon: faDumbbell, 
      link: '/exercises', 
      color: '#4caf50',
      description: t('dashboard.practiceMindfulness')
    },
    { 
      title: t('dashboard.writeJournal'), 
      icon: faBook, 
      link: '/journal', 
      color: '#ff9800',
      description: t('dashboard.reflectDay')
    }
  ];

  if (!user) {
    return (
      <div className="dashboard">
        <div className="container">
          <div className="auth-required">
            <h2>{t('dashboard.pleaseLogin')}</h2>
            <Link to="/login" className="btn btn-primary">{t('nav.login')}</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        {/* Welcome Section */}
        <motion.div 
          className="dashboard-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="welcome-section">
            <div className="welcome-text">
              <h1>{t('dashboard.welcomeBack', { name: user.name })} 👋</h1>
              <p className="date">{getTodayDate()}</p>
              <p className="streak">🔥 {t('dashboard.dayStreak', { count: streakCount })}</p>
            </div>
            <div className="today-mood">
              {todayMood ? (
                <div className="mood-display">
                  <span className="mood-label">{t('dashboard.todaysMood')}</span>
                  <div className="mood-value">
                    <FontAwesomeIcon 
                      icon={getMoodIcon(todayMood).icon} 
                      style={{ color: getMoodIcon(todayMood).color }}
                    />
                    <span>{todayMood}/10</span>
                  </div>
                </div>
              ) : (
                <Link to="/mood-tracker" className="mood-prompt">
                  <FontAwesomeIcon icon={faHeart} />
                  <span>{t('dashboard.logTodaysMood')}</span>
                </Link>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.section 
          className="quick-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2>{t('dashboard.quickActions')}</h2>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <Link to={action.link} className="action-card">
                  <div className="action-icon" style={{ backgroundColor: action.color }}>
                    <FontAwesomeIcon icon={action.icon} />
                  </div>
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <div className="dashboard-content">
          {/* Weekly Goals */}
          <motion.section 
            className="weekly-goals"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="section-header">
              <h2>{t('dashboard.thisWeeksGoals')}</h2>
              <Link to="/profile" className="view-all">{t('dashboard.viewAll')}</Link>
            </div>
            <div className="goals-list">
              {weeklyGoals.map(goal => (
                <div key={goal.id} className="goal-item">
                  <div className="goal-info">
                    <h4>{goal.title}</h4>
                    <p>{t('dashboard.goalCompleted', { completed: goal.completed, target: goal.target })}</p>
                  </div>
                  <div className="goal-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{goal.progress}%</span>
                  </div>
                  {goal.progress === 100 && (
                    <FontAwesomeIcon icon={faCheckCircle} className="completed-icon" />
                  )}
                </div>
              ))}
            </div>
          </motion.section>

          {/* Mood Chart */}
          <motion.section 
            className="mood-chart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="section-header">
              <h2>{t('dashboard.weeklyMoodTrends')}</h2>
              <Link to="/mood-tracker" className="view-all">{t('dashboard.viewDetails')}</Link>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="#2196f3" 
                    strokeWidth={3}
                    dot={{ fill: '#2196f3', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="energy" 
                    stroke="#4caf50" 
                    strokeWidth={2}
                    dot={{ fill: '#4caf50', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.section>
        </div>

        {/* Recent Activity */}
        <motion.section 
          className="recent-activity"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="section-header">
            <h2>{t('dashboard.recentActivity')}</h2>
            <Link to="/profile" className="view-all">{t('dashboard.viewAll')}</Link>
          </div>
          <div className="activity-list">
            {recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  <FontAwesomeIcon icon={activity.icon} />
                </div>
                <div className="activity-content">
                  <h4>{activity.title}</h4>
                  <p>{activity.description}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Insights */}
        <motion.section 
          className="insights"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2>{t('dashboard.yourInsights')}</h2>
          <div className="insights-grid">
            <div className="insight-card positive">
              <FontAwesomeIcon icon={faArrowTrendUp} />
              <h3>{t('dashboard.moodImproving')}</h3>
              <p>{t('dashboard.moodIncreased')}</p>
            </div>
            <div className="insight-card neutral">
              <FontAwesomeIcon icon={faChartLine} />
              <h3>{t('dashboard.consistentCheckins')}</h3>
              <p>{t('dashboard.greatJobLogging')}</p>
            </div>
            <div className="insight-card suggestion">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              <h3>{t('dashboard.recommendation')}</h3>
              <p>{t('dashboard.considerMeditation')}</p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
