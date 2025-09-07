import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
        { id: 1, title: 'Daily Meditation', progress: 80, target: 7, completed: 6 },
        { id: 2, title: 'Mood Check-ins', progress: 100, target: 7, completed: 7 },
        { id: 3, title: 'Journal Entries', progress: 60, target: 5, completed: 3 },
        { id: 4, title: 'Exercise Sessions', progress: 40, target: 3, completed: 1 }
      ];

      const mockActivity = [
        { 
          id: 1, 
          type: 'mood', 
          title: 'Mood Check-in', 
          description: 'Feeling good today!', 
          time: '2 hours ago',
          icon: faHeart 
        },
        { 
          id: 2, 
          type: 'chat', 
          title: 'AI Therapy Session', 
          description: 'Discussed anxiety management techniques', 
          time: '1 day ago',
          icon: faComments 
        },
        { 
          id: 3, 
          type: 'exercise', 
          title: 'Breathing Exercise', 
          description: 'Completed 10-minute deep breathing', 
          time: '2 days ago',
          icon: faDumbbell 
        },
        { 
          id: 4, 
          type: 'journal', 
          title: 'Journal Entry', 
          description: 'Reflected on today\'s experiences', 
          time: '3 days ago',
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
      title: 'Log Mood', 
      icon: faHeart, 
      link: '/mood-tracker', 
      color: '#e91e63',
      description: 'Track how you\'re feeling'
    },
    { 
      title: 'Start Chat', 
      icon: faComments, 
      link: '/chat', 
      color: '#2196f3',
      description: 'Talk to AI therapist'
    },
    { 
      title: 'Do Exercise', 
      icon: faDumbbell, 
      link: '/exercises', 
      color: '#4caf50',
      description: 'Practice mindfulness'
    },
    { 
      title: 'Write Journal', 
      icon: faBook, 
      link: '/journal', 
      color: '#ff9800',
      description: 'Reflect on your day'
    }
  ];

  if (!user) {
    return (
      <div className="dashboard">
        <div className="container">
          <div className="auth-required">
            <h2>Please log in to view your dashboard</h2>
            <Link to="/login" className="btn btn-primary">Login</Link>
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
              <h1>Welcome back, {user.name}! 👋</h1>
              <p className="date">{getTodayDate()}</p>
              <p className="streak">🔥 {streakCount} day streak of self-care!</p>
            </div>
            <div className="today-mood">
              {todayMood ? (
                <div className="mood-display">
                  <span className="mood-label">Today's Mood</span>
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
                  <span>Log Today's Mood</span>
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
          <h2>Quick Actions</h2>
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
              <h2>This Week's Goals</h2>
              <Link to="/profile" className="view-all">View All</Link>
            </div>
            <div className="goals-list">
              {weeklyGoals.map(goal => (
                <div key={goal.id} className="goal-item">
                  <div className="goal-info">
                    <h4>{goal.title}</h4>
                    <p>{goal.completed}/{goal.target} completed</p>
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
              <h2>Weekly Mood Trends</h2>
              <Link to="/mood-tracker" className="view-all">View Details</Link>
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
            <h2>Recent Activity</h2>
            <Link to="/profile" className="view-all">View All</Link>
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
          <h2>Your Insights</h2>
          <div className="insights-grid">
            <div className="insight-card positive">
              <FontAwesomeIcon icon={faArrowTrendUp} />
              <h3>Mood Improving</h3>
              <p>Your mood has increased by 20% this week compared to last week.</p>
            </div>
            <div className="insight-card neutral">
              <FontAwesomeIcon icon={faChartLine} />
              <h3>Consistent Check-ins</h3>
              <p>Great job logging your mood daily! Consistency helps track patterns.</p>
            </div>
            <div className="insight-card suggestion">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              <h3>Recommendation</h3>
              <p>Consider adding more meditation sessions to help with stress management.</p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
