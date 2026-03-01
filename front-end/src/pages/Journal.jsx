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
import { useTranslation } from 'react-i18next';

export default function Journal({ user }) {
  const { t } = useTranslation();
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
    { value: 1, label: t('journal.moods.veryLow'), icon: faFrown, color: '#f44336' },
    { value: 2, label: t('journal.moods.low'), icon: faFrown, color: '#ff5722' },
    { value: 3, label: t('journal.moods.belowAverage'), icon: faMeh, color: '#ff9800' },
    { value: 4, label: t('journal.moods.neutral'), icon: faMeh, color: '#ffc107' },
    { value: 5, label: t('journal.moods.average'), icon: faMeh, color: '#ffeb3b' },
    { value: 6, label: t('journal.moods.good'), icon: faSmile, color: '#8bc34a' },
    { value: 7, label: t('journal.moods.veryGood'), icon: faSmile, color: '#4caf50' },
    { value: 8, label: t('journal.moods.great'), icon: faSmile, color: '#2196f3' },
    { value: 9, label: t('journal.moods.excellent'), icon: faSmile, color: '#3f51b5' },
    { value: 10, label: t('journal.moods.amazing'), icon: faSmile, color: '#9c27b0' }
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
    if (confirm(t('journal.deleteConfirm'))) {
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
            <h2>{t('journal.loginRequired')}</h2>
            <p>{t('journal.loginDescription')}</p>
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
              {t('journal.pageTitle')}
            </h1>
            <p>{t('journal.pageDescription')}</p>
          </div>
          
          <div className="header-actions">
            <button 
              className="btn btn-outline"
              onClick={() => setShowPrompts(!showPrompts)}
            >
              {t('journal.writingPrompts')}
            </button>
            <button 
              className="btn btn-outline"
              onClick={exportEntries}
            >
              <FontAwesomeIcon icon={faDownload} />
              {t('journal.export')}
            </button>
            <button 
              className="btn btn-primary"
              onClick={startNewEntry}
            >
              <FontAwesomeIcon icon={faPlus} />
              {t('journal.newEntry')}
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
                <h3>{t('journal.writingPrompts')}</h3>
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
                  {t('journal.close')}
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
                <h2>{editingEntry ? t('journal.editEntry') : t('journal.newJournalEntry')}</h2>
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
                  placeholder={t('journal.titlePlaceholder')}
                  value={currentEntry.title}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, title: e.target.value }))}
                  className="title-input"
                />

                <textarea
                  placeholder={t('journal.contentPlaceholder')}
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
                      {t('journal.howFeeling')}
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
                      {t('journal.tags')}
                    </h4>
                    
                    <div className="tag-input">
                      <input
                        type="text"
                        placeholder={t('journal.addTag')}
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag(newTag)}
                      />
                      <button onClick={() => addTag(newTag)}>
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>

                    <div className="common-tags">
                      <p>{t('journal.commonTags')}</p>
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
                        <p>{t('journal.selectedTags')}</p>
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
                      {t('journal.privacy')}
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
                      <span>{t('journal.keepPrivate')}</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="editor-actions">
                <div className="word-count">
                  {t('journal.wordCount')} {currentEntry.content.split(' ').filter(word => word.length > 0).length}
                </div>
                <div className="action-buttons">
                  <button 
                    className="btn btn-outline"
                    onClick={() => setIsWriting(false)}
                  >
                    {t('journal.cancel')}
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={saveEntry}
                    disabled={!currentEntry.title.trim() || !currentEntry.content.trim()}
                  >
                    <FontAwesomeIcon icon={faSave} />
                    {editingEntry ? t('journal.updateEntry') : t('journal.saveEntry')}
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
                placeholder={t('journal.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-options">
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                <option value="">{t('journal.allTags')}</option>
                {getAllTags().map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>

              <select
                value={selectedMoodFilter}
                onChange={(e) => setSelectedMoodFilter(e.target.value)}
              >
                <option value="">{t('journal.allMoods')}</option>
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
                <h3>{t('journal.noEntries')}</h3>
                <p>{t('journal.startWriting')}</p>
                <button className="btn btn-primary" onClick={startNewEntry}>
                  <FontAwesomeIcon icon={faPlus} />
                  {t('journal.writeFirst')}
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
