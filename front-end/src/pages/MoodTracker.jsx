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
import 'react-calendar/dist/Calendar.css';

export default function MoodTracker({ user }) {
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
    { key: 'overall', label: 'Overall Mood', icon: faHeart, color: '#e91e63' },
    { key: 'anxiety', label: 'Anxiety Level', icon: faFrown, color: '#f44336' },
    { key: 'energy', label: 'Energy Level', icon: faSmile, color: '#4caf50' },
    { key: 'sleep', label: 'Sleep Quality', icon: faMeh, color: '#2196f3' },
    { key: 'stress', label: 'Stress Level', icon: faFrown, color: '#ff9800' },
    { key: 'social', label: 'Social Connection', icon: faSmile, color: '#9c27b0' }
  ];

  const commonTriggers = [
    'Work stress', 'Family issues', 'Health concerns', 'Financial worry', 
    'Relationship problems', 'Sleep deprivation', 'Weather', 'Social media',
    'Exercise', 'Good news', 'Achievement', 'Social interaction'
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
    alert('Mood entry saved successfully!');
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
            <h2>Please log in to track your mood</h2>
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
            Mood Tracker
          </h1>
          <p>Track your emotional well-being and discover patterns in your mental health</p>
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
              <h2>How are you feeling?</h2>
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
                      <span>Low</span>
                      <span>Medium</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mood Radar Chart */}
            <div className="mood-radar">
              <h3>Today's Mood Overview</h3>
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
              <h3>What influenced your mood today?</h3>
              
              <div className="common-triggers">
                <h4>Common Triggers:</h4>
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
                    placeholder="Add custom trigger..."
                    onKeyPress={(e) => e.key === 'Enter' && addTrigger(newTrigger)}
                  />
                  <button onClick={() => addTrigger(newTrigger)}>
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </div>

              {triggers.length > 0 && (
                <div className="selected-triggers">
                  <h4>Selected Triggers:</h4>
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
              <h3>Additional Notes</h3>
              <textarea
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
                placeholder="How was your day? Any thoughts or feelings you'd like to record?"
                rows={4}
              />
            </div>

            <button 
              className="btn btn-primary save-mood-btn"
              onClick={saveMoodEntry}
            >
              <FontAwesomeIcon icon={faSave} />
              {savedToday ? 'Update Entry' : 'Save Entry'}
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
                Mood Analytics
              </h2>
              <button 
                className="btn btn-outline"
                onClick={() => setShowMoodLog(!showMoodLog)}
              >
                {showMoodLog ? 'Hide' : 'Show'} Mood Log
              </button>
            </div>

            {/* Trend Chart */}
            <div className="chart-container">
              <h3>14-Day Mood Trends</h3>
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
                    name="Overall Mood"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="energy" 
                    stroke="#4caf50" 
                    strokeWidth={2}
                    name="Energy"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="anxiety" 
                    stroke="#f44336" 
                    strokeWidth={2}
                    name="Low Anxiety"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Calendar View */}
            <div className="mood-calendar">
              <h3>Mood Calendar</h3>
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
                <h3>Recent Entries</h3>
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
