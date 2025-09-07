import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBook, 
  faPlus, 
  faEdit, 
  faTrash,
  faSave,
  faSearch,
  faFilter,
  faCalendar,
  faHeart,
  faSmile,
  faMeh,
  faFrown,
  faTags,
  faLock,
  faEye,
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

export default function Journal({ user }) {
  const [entries, setEntries] = useState([]);
  const [isWriting, setIsWriting] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [currentEntry, setCurrentEntry] = useState({
    title: '',
    content: '',
    mood: 5,
    tags: [],
    isPrivate: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState('');
  const [showPrompts, setShowPrompts] = useState(false);
  const [newTag, setNewTag] = useState('');

  const journalPrompts = [
    "What am I grateful for today?",
    "How am I feeling right now and why?",
    "What challenged me today and how did I handle it?",
    "What did I learn about myself today?",
    "What would I like to improve tomorrow?",
    "What made me smile today?",
    "What am I worried about and how can I address it?",
    "What are three things that went well today?",
    "How did I take care of my mental health today?",
    "What would I tell a friend in my situation?",
    "What patterns do I notice in my thoughts or behaviors?",
    "What am I looking forward to?",
    "How can I be kinder to myself?",
    "What does self-care look like for me today?",
    "What emotions did I experience today?"
  ];

  const moodOptions = [
    { value: 1, label: 'Very Low', icon: faFrown, color: '#f44336' },
    { value: 2, label: 'Low', icon: faFrown, color: '#ff5722' },
    { value: 3, label: 'Below Average', icon: faMeh, color: '#ff9800' },
    { value: 4, label: 'Neutral', icon: faMeh, color: '#ffc107' },
    { value: 5, label: 'Average', icon: faMeh, color: '#ffeb3b' },
    { value: 6, label: 'Good', icon: faSmile, color: '#8bc34a' },
    { value: 7, label: 'Very Good', icon: faSmile, color: '#4caf50' },
    { value: 8, label: 'Great', icon: faSmile, color: '#2196f3' },
    { value: 9, label: 'Excellent', icon: faSmile, color: '#3f51b5' },
    { value: 10, label: 'Amazing', icon: faSmile, color: '#9c27b0' }
  ];

  const commonTags = [
    'Gratitude', 'Anxiety', 'Work', 'Family', 'Relationships', 'Goals',
    'Self-care', 'Stress', 'Achievement', 'Challenge', 'Growth', 'Health',
    'Happiness', 'Reflection', 'Dreams', 'Fears', 'Hope', 'Love'
  ];

  useEffect(() => {
    // Load journal entries (mock data)
    const mockEntries = generateMockEntries();
    setEntries(mockEntries);
  }, []);

  const generateMockEntries = () => {
    const entries = [];
    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      entries.push({
        id: Date.now() + i,
        title: i === 0 ? "Today's Reflections" : `Journal Entry ${10 - i}`,
        content: `This is a sample journal entry for ${date.toDateString()}. I'm feeling reflective today and wanted to write down my thoughts...`,
        mood: Math.floor(Math.random() * 10) + 1,
        tags: ['Reflection', 'Growth'].slice(0, Math.floor(Math.random() * 2) + 1),
        date: date.toISOString(),
        isPrivate: true,
        wordCount: 50 + Math.floor(Math.random() * 200)
      });
    }
    return entries;
  };

  const startNewEntry = () => {
    setCurrentEntry({
      title: '',
      content: '',
      mood: 5,
      tags: [],
      isPrivate: true
    });
    setEditingEntry(null);
    setIsWriting(true);
  };

  const editEntry = (entry) => {
    setCurrentEntry({
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      tags: entry.tags,
      isPrivate: entry.isPrivate
    });
    setEditingEntry(entry);
    setIsWriting(true);
  };

  const saveEntry = () => {
    const entryData = {
      ...currentEntry,
      id: editingEntry ? editingEntry.id : Date.now(),
      date: editingEntry ? editingEntry.date : new Date().toISOString(),
      wordCount: currentEntry.content.split(' ').length,
      updatedAt: new Date().toISOString()
    };

    if (editingEntry) {
      setEntries(prev => prev.map(entry => 
        entry.id === editingEntry.id ? entryData : entry
      ));
    } else {
      setEntries(prev => [entryData, ...prev]);
    }

    setIsWriting(false);
    setEditingEntry(null);
    setCurrentEntry({
      title: '',
      content: '',
      mood: 5,
      tags: [],
      isPrivate: true
    });
  };

  const deleteEntry = (entryId) => {
    if (confirm('Are you sure you want to delete this journal entry?')) {
      setEntries(prev => prev.filter(entry => entry.id !== entryId));
    }
  };

  const addTag = (tag) => {
    if (tag && !currentEntry.tags.includes(tag)) {
      setCurrentEntry(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setNewTag('');
  };

  const removeTag = (tagToRemove) => {
    setCurrentEntry(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const usePrompt = (prompt) => {
    setCurrentEntry(prev => ({
      ...prev,
      content: prev.content + (prev.content ? '\n\n' : '') + prompt + '\n\n'
    }));
    setShowPrompts(false);
  };

  const getMoodOption = (moodValue) => {
    return moodOptions.find(option => option.value === moodValue) || moodOptions[4];
  };

  const getAllTags = () => {
    const allTags = entries.reduce((tags, entry) => {
      return [...tags, ...entry.tags];
    }, []);
    return [...new Set(allTags)];
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || entry.tags.includes(selectedTag);
    const matchesMood = !selectedMoodFilter || entry.mood.toString() === selectedMoodFilter;
    
    return matchesSearch && matchesTag && matchesMood;
  });

  const exportEntries = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalEntries: entries.length,
      entries: entries.map(entry => ({
        ...entry,
        dateFormatted: format(parseISO(entry.date), 'PPP')
      }))
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `mindcare-journal-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!user) {
    return (
      <div className="journal-page">
        <div className="container">
          <div className="auth-required">
            <FontAwesomeIcon icon={faBook} size="3x" />
            <h2>Please log in to access your personal journal</h2>
            <p>Write, reflect, and track your mental health journey</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="journal-page">
      <div className="container">
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <h1>
              <FontAwesomeIcon icon={faBook} />
              Personal Journal
            </h1>
            <p>Your private space for reflection, growth, and mental wellness</p>
          </div>
          
          <div className="header-actions">
            <button 
              className="btn btn-outline"
              onClick={() => setShowPrompts(!showPrompts)}
            >
              Writing Prompts
            </button>
            <button 
              className="btn btn-outline"
              onClick={exportEntries}
            >
              <FontAwesomeIcon icon={faDownload} />
              Export
            </button>
            <button 
              className="btn btn-primary"
              onClick={startNewEntry}
            >
              <FontAwesomeIcon icon={faPlus} />
              New Entry
            </button>
          </div>
        </motion.div>

        {/* Writing Prompts Modal */}
        <AnimatePresence>
          {showPrompts && (
            <motion.div 
              className="prompts-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPrompts(false)}
            >
              <motion.div 
                className="prompts-content"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                <h3>Writing Prompts</h3>
                <p>Choose a prompt to inspire your journal entry:</p>
                <div className="prompts-grid">
                  {journalPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      className="prompt-card"
                      onClick={() => usePrompt(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
                <button 
                  className="close-prompts"
                  onClick={() => setShowPrompts(false)}
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Journal Editor */}
        <AnimatePresence>
          {isWriting && (
            <motion.div 
              className="journal-editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="editor-header">
                <h2>{editingEntry ? 'Edit Entry' : 'New Journal Entry'}</h2>
                <div className="editor-meta">
                  <span className="date">
                    <FontAwesomeIcon icon={faCalendar} />
                    {format(new Date(), 'PPP')}
                  </span>
                </div>
              </div>

              <div className="editor-content">
                <input
                  type="text"
                  placeholder="Entry title..."
                  value={currentEntry.title}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, title: e.target.value }))}
                  className="title-input"
                />

                <textarea
                  placeholder="Start writing your thoughts..."
                  value={currentEntry.content}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, content: e.target.value }))}
                  className="content-textarea"
                  rows={15}
                />

                <div className="editor-sidebar">
                  {/* Mood Selector */}
                  <div className="mood-selector">
                    <h4>
                      <FontAwesomeIcon icon={faHeart} />
                      How are you feeling?
                    </h4>
                    <div className="mood-options">
                      {moodOptions.map(option => (
                        <button
                          key={option.value}
                          className={`mood-option ${currentEntry.mood === option.value ? 'active' : ''}`}
                          onClick={() => setCurrentEntry(prev => ({ ...prev, mood: option.value }))}
                          style={{ backgroundColor: option.color }}
                          title={option.label}
                        >
                          <FontAwesomeIcon icon={option.icon} />
                          <span>{option.value}</span>
                        </button>
                      ))}
                    </div>
                    <p className="selected-mood">
                      Selected: {getMoodOption(currentEntry.mood).label}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="tags-selector">
                    <h4>
                      <FontAwesomeIcon icon={faTags} />
                      Tags
                    </h4>
                    
                    <div className="tag-input">
                      <input
                        type="text"
                        placeholder="Add a tag..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag(newTag)}
                      />
                      <button onClick={() => addTag(newTag)}>
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>

                    <div className="common-tags">
                      <p>Common tags:</p>
                      <div className="tag-buttons">
                        {commonTags.map(tag => (
                          <button
                            key={tag}
                            className={`tag-btn ${currentEntry.tags.includes(tag) ? 'active' : ''}`}
                            onClick={() => 
                              currentEntry.tags.includes(tag) 
                                ? removeTag(tag) 
                                : addTag(tag)
                            }
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {currentEntry.tags.length > 0 && (
                      <div className="selected-tags">
                        <p>Selected tags:</p>
                        <div className="tag-list">
                          {currentEntry.tags.map(tag => (
                            <span key={tag} className="tag">
                              {tag}
                              <button onClick={() => removeTag(tag)}>×</button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Privacy */}
                  <div className="privacy-selector">
                    <h4>
                      <FontAwesomeIcon icon={faLock} />
                      Privacy
                    </h4>
                    <label className="privacy-toggle">
                      <input
                        type="checkbox"
                        checked={currentEntry.isPrivate}
                        onChange={(e) => setCurrentEntry(prev => ({ 
                          ...prev, 
                          isPrivate: e.target.checked 
                        }))}
                      />
                      <span>Keep this entry private</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="editor-actions">
                <div className="word-count">
                  Words: {currentEntry.content.split(' ').filter(word => word.length > 0).length}
                </div>
                <div className="action-buttons">
                  <button 
                    className="btn btn-outline"
                    onClick={() => setIsWriting(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={saveEntry}
                    disabled={!currentEntry.title.trim() || !currentEntry.content.trim()}
                  >
                    <FontAwesomeIcon icon={faSave} />
                    {editingEntry ? 'Update Entry' : 'Save Entry'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters and Search */}
        {!isWriting && (
          <motion.div 
            className="journal-filters"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="search-bar">
              <FontAwesomeIcon icon={faSearch} />
              <input
                type="text"
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-options">
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                <option value="">All Tags</option>
                {getAllTags().map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>

              <select
                value={selectedMoodFilter}
                onChange={(e) => setSelectedMoodFilter(e.target.value)}
              >
                <option value="">All Moods</option>
                {moodOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}

        {/* Journal Entries */}
        {!isWriting && (
          <motion.div 
            className="journal-entries"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {filteredEntries.length === 0 ? (
              <div className="no-entries">
                <FontAwesomeIcon icon={faBook} size="3x" />
                <h3>No journal entries found</h3>
                <p>Start writing to capture your thoughts and feelings</p>
                <button className="btn btn-primary" onClick={startNewEntry}>
                  <FontAwesomeIcon icon={faPlus} />
                  Write First Entry
                </button>
              </div>
            ) : (
              <div className="entries-grid">
                {filteredEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    className="entry-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="entry-header">
                      <div className="entry-meta">
                        <h3>{entry.title}</h3>
                        <div className="entry-info">
                          <span className="date">
                            {format(parseISO(entry.date), 'MMM d, yyyy')}
                          </span>
                          <div className="mood-indicator">
                            <FontAwesomeIcon 
                              icon={getMoodOption(entry.mood).icon}
                              style={{ color: getMoodOption(entry.mood).color }}
                            />
                            <span>{entry.mood}/10</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="entry-actions">
                        <button
                          className="action-btn"
                          onClick={() => editEntry(entry)}
                          title="Edit entry"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => deleteEntry(entry.id)}
                          title="Delete entry"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>

                    <div className="entry-content">
                      <p>{entry.content.substring(0, 150)}...</p>
                    </div>

                    <div className="entry-footer">
                      <div className="entry-tags">
                        {entry.tags.map(tag => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                      </div>
                      
                      <div className="entry-stats">
                        <span className="word-count">{entry.wordCount} words</span>
                        {entry.isPrivate && (
                          <FontAwesomeIcon icon={faLock} title="Private entry" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
