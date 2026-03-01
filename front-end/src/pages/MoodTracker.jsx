import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSmile, 
  faMeh, 
  faFrown,
  faHeart,
  faCalendar,
  faChartLine,
  faSave,
  faPlus,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import Calendar from 'react-calendar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import 'react-calendar/dist/Calendar.css';

export default function MoodTracker({ user }) {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMood, setCurrentMood] = useState({
    overall: 5,
    anxiety: 5,
    energy: 5,
    sleep: 5,
    stress: 5,
    social: 5
  });
  const [moodNote, setMoodNote] = useState('');
  const [triggers, setTriggers] = useState([]);
  const [newTrigger, setNewTrigger] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const [showMoodLog, setShowMoodLog] = useState(false);
  const [savedToday, setSavedToday] = useState(false);

  const moodCategories = [
    { key: 'overall', label: t('moodTracker.categories.overallMood'), icon: faHeart, color: '#e91e63' },
    { key: 'anxiety', label: t('moodTracker.categories.anxietyLevel'), icon: faFrown, color: '#f44336' },
    { key: 'energy', label: t('moodTracker.categories.energyLevel'), icon: faSmile, color: '#4caf50' },
    { key: 'sleep', label: t('moodTracker.categories.sleepQuality'), icon: faMeh, color: '#2196f3' },
    { key: 'stress', label: t('moodTracker.categories.stressLevel'), icon: faFrown, color: '#ff9800' },
    { key: 'social', label: t('moodTracker.categories.socialConnection'), icon: faSmile, color: '#9c27b0' }
  ];

  const commonTriggers = [
    t('moodTracker.triggers.items.work'),
    t('moodTracker.triggers.items.family'),
    t('moodTracker.triggers.items.health'),
    t('moodTracker.triggers.items.finances'),
    t('moodTracker.triggers.items.relationships'),
    t('moodTracker.triggers.items.sleep'),
    t('moodTracker.triggers.items.weather'),
    t('moodTracker.triggers.items.social'),
    t('moodTracker.triggers.items.exercise'),
    t('moodTracker.triggers.items.diet'),
    t('moodTracker.triggers.items.news'),
    t('moodTracker.triggers.items.other')
  ];

  useEffect(() => {
    // Load mood history (mock data)
    const mockHistory = generateMockHistory();
    setMoodHistory(mockHistory);
    
    // Check if mood already logged today
    const today = new Date().toDateString();
    const todayEntry = mockHistory.find(entry => 
      new Date(entry.date).toDateString() === today
    );
    if (todayEntry) {
      setSavedToday(true);
      setCurrentMood(todayEntry.mood);
      setMoodNote(todayEntry.note || '');
      setTriggers(todayEntry.triggers || []);
    }
  }, []);

  const generateMockHistory = () => {
    const history = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      history.push({
        date: date.toISOString(),
        mood: {
          overall: Math.floor(Math.random() * 5) + 4,
          anxiety: Math.floor(Math.random() * 4) + 2,
          energy: Math.floor(Math.random() * 4) + 4,
          sleep: Math.floor(Math.random() * 3) + 5,
          stress: Math.floor(Math.random() * 4) + 3,
          social: Math.floor(Math.random() * 3) + 5
        },
        note: i % 3 === 0 ? 'Feeling good today!' : '',
        triggers: i % 4 === 0 ? ['Work stress'] : []
      });
    }
    return history;
  };

  const handleMoodChange = (category, value) => {
    setCurrentMood(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const addTrigger = (trigger) => {
    if (trigger && !triggers.includes(trigger)) {
      setTriggers(prev => [...prev, trigger]);
    }
    setNewTrigger('');
  };

  const removeTrigger = (trigger) => {
    setTriggers(prev => prev.filter(t => t !== trigger));
  };

  const saveMoodEntry = () => {
    const entry = {
      date: selectedDate.toISOString(),
      mood: currentMood,
      note: moodNote,
      triggers: triggers
    };

    // Update history
    const updatedHistory = moodHistory.filter(h => 
      new Date(h.date).toDateString() !== selectedDate.toDateString()
    );
    updatedHistory.push(entry);
    updatedHistory.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    setMoodHistory(updatedHistory);
    setSavedToday(true);
    
    // Show success message
    alert(t('moodTracker.success'));
  };

  const getMoodColor = (value) => {
    if (value >= 8) return '#4caf50';
    if (value >= 6) return '#ff9800';
    if (value >= 4) return '#ffeb3b';
    return '#f44336';
  };

  const getChartData = () => {
    return moodHistory.slice(-14).map(entry => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      overall: entry.mood.overall,
      anxiety: 10 - entry.mood.anxiety, // Invert anxiety for better visualization
      energy: entry.mood.energy,
      sleep: entry.mood.sleep
    }));
  };

  const getRadarData = () => {
    return moodCategories.map(category => ({
      category: category.label,
      value: currentMood[category.key],
      fullMark: 10
    }));
  };

  if (!user) {
    return (
      <div className="mood-tracker">
        <div className="container">
          <div className="auth-required">
            <h2>{t('moodTracker.loginRequired')}</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mood-tracker">
      <div className="container">
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>
            <FontAwesomeIcon icon={faHeart} />
            {t('moodTracker.pageTitle')}
          </h1>
          <p>{t('moodTracker.pageDescription')}</p>
        </motion.div>

        <div className="mood-tracker-content">
          {/* Current Mood Entry */}
          <motion.section 
            className="mood-entry"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="section-header">
              <h2>{t('moodTracker.howFeeling')}</h2>
              <div className="date-selector">
                <FontAwesomeIcon icon={faCalendar} />
                <span>{selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>

            <div className="mood-categories">
              {moodCategories.map(category => (
                <div key={category.key} className="mood-category">
                  <div className="category-header">
                    <FontAwesomeIcon 
                      icon={category.icon} 
                      style={{ color: category.color }}
                    />
                    <span>{category.label}</span>
                    <span className="mood-value">
                      {currentMood[category.key]}/10
                    </span>
                  </div>
                  
                  <div className="mood-slider">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={currentMood[category.key]}
                      onChange={(e) => handleMoodChange(category.key, parseInt(e.target.value))}
                      className="slider"
                      style={{
                        background: `linear-gradient(to right, #f44336 0%, #ff9800 50%, #4caf50 100%)`
                      }}
                    />
                    <div className="slider-labels">
                      <span>{t('moodTracker.levels.low')}</span>
                      <span>{t('moodTracker.levels.medium')}</span>
                      <span>{t('moodTracker.levels.high')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mood Radar Chart */}
            <div className="mood-radar">
              <h3>{t('moodTracker.todaysOverview')}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={getRadarData()}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} />
                  <Radar
                    name="Mood"
                    dataKey="value"
                    stroke="#2196f3"
                    fill="#2196f3"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Triggers */}
            <div className="triggers-section">
              <h3>{t('moodTracker.triggers.title')}</h3>
              
              <div className="common-triggers">
                <h4>{t('moodTracker.triggers.common')}</h4>
                <div className="trigger-buttons">
                  {commonTriggers.map(trigger => (
                    <button
                      key={trigger}
                      className={`trigger-btn ${triggers.includes(trigger) ? 'active' : ''}`}
                      onClick={() => 
                        triggers.includes(trigger) 
                          ? removeTrigger(trigger) 
                          : addTrigger(trigger)
                      }
                    >
                      {trigger}
                    </button>
                  ))}
                </div>
              </div>

              <div className="custom-trigger">
                <div className="input-group">
                  <input
                    type="text"
                    value={newTrigger}
                    onChange={(e) => setNewTrigger(e.target.value)}
                    placeholder={t('moodTracker.triggers.addCustom')}
                    onKeyPress={(e) => e.key === 'Enter' && addTrigger(newTrigger)}
                  />
                  <button onClick={() => addTrigger(newTrigger)}>
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </div>

              {triggers.length > 0 && (
                <div className="selected-triggers">
                  <h4>{t('moodTracker.triggers.selected')}</h4>
                  <div className="trigger-tags">
                    {triggers.map(trigger => (
                      <span key={trigger} className="trigger-tag">
                        {trigger}
                        <button onClick={() => removeTrigger(trigger)}>
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="mood-notes">
              <h3>{t('moodTracker.notes.title')}</h3>
              <textarea
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
                placeholder={t('moodTracker.notes.placeholder')}
                rows={4}
              />
            </div>

            <button 
              className="btn btn-primary save-mood-btn"
              onClick={saveMoodEntry}
            >
              <FontAwesomeIcon icon={faSave} />
              {savedToday ? t('moodTracker.buttons.update') : t('moodTracker.buttons.save')}
            </button>
          </motion.section>

          {/* Mood History & Analytics */}
          <motion.section 
            className="mood-analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="section-header">
              <h2>
                <FontAwesomeIcon icon={faChartLine} />
                {t('moodTracker.analytics.title')}
              </h2>
              <button 
                className="btn btn-outline"
                onClick={() => setShowMoodLog(!showMoodLog)}
              >
                {showMoodLog ? t('moodTracker.analytics.hide') : t('moodTracker.analytics.show')} {t('moodTracker.analytics.moodLog')}
              </button>
            </div>

            {/* Trend Chart */}
            <div className="chart-container">
              <h3>{t('moodTracker.analytics.trends')}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="overall" 
                    stroke="#e91e63" 
                    strokeWidth={3}
                    name={t('moodTracker.analytics.overallMood')}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="energy" 
                    stroke="#4caf50" 
                    strokeWidth={2}
                    name={t('moodTracker.analytics.energy')}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="anxiety" 
                    stroke="#f44336" 
                    strokeWidth={2}
                    name={t('moodTracker.analytics.lowAnxiety')}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Calendar View */}
            <div className="mood-calendar">
              <h3>{t('moodTracker.analytics.calendar')}</h3>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={({ date, view }) => {
                  if (view === 'month') {
                    const entry = moodHistory.find(h => 
                      new Date(h.date).toDateString() === date.toDateString()
                    );
                    if (entry) {
                      const moodValue = entry.mood.overall;
                      return (
                        <div 
                          className="mood-indicator"
                          style={{ 
                            backgroundColor: getMoodColor(moodValue),
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            margin: '2px auto'
                          }}
                        />
                      );
                    }
                  }
                  return null;
                }}
              />
            </div>

            {/* Mood Log */}
            {showMoodLog && (
              <div className="mood-log">
                <h3>{t('moodTracker.analytics.recentEntries')}</h3>
                <div className="log-entries">
                  {moodHistory.slice(-10).reverse().map((entry, index) => (
                    <div key={index} className="log-entry">
                      <div className="entry-date">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="entry-content">
                        <div className="mood-summary">
                          <span 
                            className="mood-dot"
                            style={{ backgroundColor: getMoodColor(entry.mood.overall) }}
                          />
                          <span>Overall: {entry.mood.overall}/10</span>
                          <span>Energy: {entry.mood.energy}/10</span>
                          <span>Anxiety: {entry.mood.anxiety}/10</span>
                        </div>
                        {entry.note && (
                          <p className="entry-note">{entry.note}</p>
                        )}
                        {entry.triggers.length > 0 && (
                          <div className="entry-triggers">
                            {entry.triggers.map(trigger => (
                              <span key={trigger} className="trigger-tag small">
                                {trigger}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </div>
  );
}
