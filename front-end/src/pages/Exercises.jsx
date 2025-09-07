import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDumbbell, 
  faPlay, 
  faPause, 
  faStop,
  faRedo,
  faHeart,
  faLungs,
  faBrain,
  faLeaf,
  faClock,
  faCheckCircle,
  faVolumeUp,
  faVolumeOff
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

export default function Exercises({ user }) {
  const [activeExercise, setActiveExercise] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [phase, setPhase] = useState('');
  const [completedExercises, setCompletedExercises] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const exerciseCategories = [
    { id: 'all', label: 'All Exercises', icon: faDumbbell },
    { id: 'breathing', label: 'Breathing', icon: faLungs },
    { id: 'meditation', label: 'Meditation', icon: faBrain },
    { id: 'relaxation', label: 'Relaxation', icon: faLeaf },
    { id: 'mindfulness', label: 'Mindfulness', icon: faHeart }
  ];

  const exercises = [
    {
      id: 'box-breathing',
      title: 'Box Breathing',
      category: 'breathing',
      duration: 240, // 4 minutes
      difficulty: 'Beginner',
      description: 'A calming breathing technique used by Navy SEALs to reduce stress and improve focus.',
      benefits: ['Reduces anxiety', 'Improves focus', 'Lowers stress'],
      instructions: [
        'Sit comfortably with your back straight',
        'Breathe in for 4 counts',
        'Hold your breath for 4 counts',
        'Breathe out for 4 counts',
        'Hold empty lungs for 4 counts',
        'Repeat the cycle'
      ],
      phases: [
        { name: 'Breathe In', duration: 4 },
        { name: 'Hold', duration: 4 },
        { name: 'Breathe Out', duration: 4 },
        { name: 'Hold', duration: 4 }
      ]
    },
    {
      id: '4-7-8-breathing',
      title: '4-7-8 Breathing',
      category: 'breathing',
      duration: 180, // 3 minutes
      difficulty: 'Beginner',
      description: 'Dr. Andrew Weil\'s technique for natural tranquilization of the nervous system.',
      benefits: ['Promotes sleep', 'Reduces anxiety', 'Calms mind'],
      instructions: [
        'Sit with your back straight',
        'Exhale completely through your mouth',
        'Breathe in through nose for 4 counts',
        'Hold breath for 7 counts',
        'Exhale through mouth for 8 counts',
        'Repeat 3-4 cycles'
      ],
      phases: [
        { name: 'Breathe In', duration: 4 },
        { name: 'Hold', duration: 7 },
        { name: 'Breathe Out', duration: 8 },
        { name: 'Rest', duration: 2 }
      ]
    },
    {
      id: 'body-scan',
      title: 'Progressive Body Scan',
      category: 'meditation',
      duration: 600, // 10 minutes
      difficulty: 'Intermediate',
      description: 'A mindfulness practice that promotes deep relaxation and body awareness.',
      benefits: ['Deep relaxation', 'Body awareness', 'Tension release'],
      instructions: [
        'Lie down comfortably',
        'Close your eyes and breathe naturally',
        'Start with your toes and work upward',
        'Notice each part of your body',
        'Release tension as you scan',
        'Take your time with each area'
      ],
      phases: [
        { name: 'Settling In', duration: 60 },
        { name: 'Feet & Legs', duration: 120 },
        { name: 'Torso & Arms', duration: 120 },
        { name: 'Head & Neck', duration: 120 },
        { name: 'Whole Body', duration: 120 },
        { name: 'Integration', duration: 60 }
      ]
    },
    {
      id: 'loving-kindness',
      title: 'Loving-Kindness Meditation',
      category: 'meditation',
      duration: 420, // 7 minutes
      difficulty: 'Beginner',
      description: 'Cultivate compassion and positive emotions toward yourself and others.',
      benefits: ['Increases compassion', 'Reduces negative emotions', 'Improves relationships'],
      instructions: [
        'Sit comfortably and close your eyes',
        'Start by sending loving wishes to yourself',
        'Extend wishes to loved ones',
        'Include neutral people',
        'Send love to difficult people',
        'Embrace all beings with compassion'
      ],
      phases: [
        { name: 'Self-Love', duration: 90 },
        { name: 'Loved Ones', duration: 90 },
        { name: 'Neutral People', duration: 90 },
        { name: 'Difficult People', duration: 90 },
        { name: 'All Beings', duration: 60 }
      ]
    },
    {
      id: 'grounding-5-4-3-2-1',
      title: '5-4-3-2-1 Grounding',
      category: 'mindfulness',
      duration: 300, // 5 minutes
      difficulty: 'Beginner',
      description: 'A sensory awareness technique to ground yourself in the present moment.',
      benefits: ['Reduces anxiety', 'Increases present awareness', 'Calms panic'],
      instructions: [
        'Look around and name 5 things you can see',
        'Notice 4 things you can touch',
        'Listen for 3 things you can hear',
        'Find 2 things you can smell',
        'Identify 1 thing you can taste',
        'Take deep breaths throughout'
      ],
      phases: [
        { name: '5 Things You See', duration: 60 },
        { name: '4 Things You Touch', duration: 60 },
        { name: '3 Things You Hear', duration: 60 },
        { name: '2 Things You Smell', duration: 60 },
        { name: '1 Thing You Taste', duration: 60 }
      ]
    },
    {
      id: 'progressive-muscle',
      title: 'Progressive Muscle Relaxation',
      category: 'relaxation',
      duration: 900, // 15 minutes
      difficulty: 'Intermediate',
      description: 'Systematically tense and relax muscle groups to achieve deep relaxation.',
      benefits: ['Reduces physical tension', 'Improves sleep', 'Decreases stress'],
      instructions: [
        'Lie down in a comfortable position',
        'Tense each muscle group for 5 seconds',
        'Release and relax for 10 seconds',
        'Notice the contrast between tension and relaxation',
        'Work through all major muscle groups',
        'End with whole-body relaxation'
      ],
      phases: [
        { name: 'Preparation', duration: 60 },
        { name: 'Face & Head', duration: 120 },
        { name: 'Arms & Shoulders', duration: 180 },
        { name: 'Chest & Back', duration: 180 },
        { name: 'Legs & Feet', duration: 240 },
        { name: 'Whole Body', duration: 120 }
      ]
    }
  ];

  useEffect(() => {
    let interval;
    if (isPlaying && activeExercise) {
      interval = setInterval(() => {
        setTimer(prev => {
          const newTime = prev + 1;
          updatePhase(newTime);
          
          // Check if exercise is complete
          if (newTime >= activeExercise.duration) {
            completeExercise();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, activeExercise]);

  const updatePhase = (currentTime) => {
    if (!activeExercise) return;
    
    let accumulatedTime = 0;
    for (const phaseData of activeExercise.phases) {
      accumulatedTime += phaseData.duration;
      if (currentTime <= accumulatedTime) {
        setPhase(phaseData.name);
        break;
      }
    }
  };

  const startExercise = (exercise) => {
    setActiveExercise(exercise);
    setTimer(0);
    setPhase(exercise.phases[0].name);
    setIsPlaying(true);
  };

  const pauseExercise = () => {
    setIsPlaying(false);
  };

  const resumeExercise = () => {
    setIsPlaying(true);
  };

  const stopExercise = () => {
    setActiveExercise(null);
    setIsPlaying(false);
    setTimer(0);
    setPhase('');
  };

  const completeExercise = () => {
    const completedExercise = {
      id: activeExercise.id,
      title: activeExercise.title,
      completedAt: new Date(),
      duration: activeExercise.duration
    };
    
    setCompletedExercises(prev => [completedExercise, ...prev]);
    setIsPlaying(false);
    
    // Play completion sound if enabled
    if (soundEnabled) {
      // In a real app, you'd play an actual sound file
      console.log('Exercise completed!');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!activeExercise) return 0;
    return (timer / activeExercise.duration) * 100;
  };

  const filteredExercises = selectedCategory === 'all' 
    ? exercises 
    : exercises.filter(ex => ex.category === selectedCategory);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#4caf50';
      case 'Intermediate': return '#ff9800';
      case 'Advanced': return '#f44336';
      default: return '#2196f3';
    }
  };

  if (!user) {
    return (
      <div className="exercises-page">
        <div className="container">
          <div className="auth-required">
            <FontAwesomeIcon icon={faDumbbell} size="3x" />
            <h2>Please log in to access mental health exercises</h2>
            <p>Guided meditation, breathing exercises, and relaxation techniques</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="exercises-page">
      <div className="container">
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>
            <FontAwesomeIcon icon={faDumbbell} />
            Mental Health Exercises
          </h1>
          <p>Evidence-based techniques for relaxation, mindfulness, and stress reduction</p>
        </motion.div>

        {/* Active Exercise Player */}
        <AnimatePresence>
          {activeExercise && (
            <motion.div 
              className="exercise-player"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="player-header">
                <h2>{activeExercise.title}</h2>
                <button 
                  className="sound-toggle"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  title={soundEnabled ? 'Disable sound' : 'Enable sound'}
                >
                  <FontAwesomeIcon icon={soundEnabled ? faVolumeUp : faVolumeOff} />
                </button>
              </div>

              <div className="exercise-visualization">
                <div className="breathing-circle">
                  <div 
                    className={`circle ${isPlaying ? 'breathing' : ''}`}
                    style={{
                      animationDuration: activeExercise.phases ? 
                        `${activeExercise.phases.reduce((sum, p) => sum + p.duration, 0)}s` : '4s'
                    }}
                  >
                    <div className="inner-circle">
                      <div className="phase-text">{phase}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="exercise-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
                <div className="time-display">
                  <span>{formatTime(timer)}</span>
                  <span>/</span>
                  <span>{formatTime(activeExercise.duration)}</span>
                </div>
              </div>

              <div className="player-controls">
                {!isPlaying ? (
                  <button className="control-btn play" onClick={resumeExercise}>
                    <FontAwesomeIcon icon={faPlay} />
                    <span>Resume</span>
                  </button>
                ) : (
                  <button className="control-btn pause" onClick={pauseExercise}>
                    <FontAwesomeIcon icon={faPause} />
                    <span>Pause</span>
                  </button>
                )}
                
                <button className="control-btn restart" onClick={() => startExercise(activeExercise)}>
                  <FontAwesomeIcon icon={faRedo} />
                  <span>Restart</span>
                </button>
                
                <button className="control-btn stop" onClick={stopExercise}>
                  <FontAwesomeIcon icon={faStop} />
                  <span>Stop</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Exercise Categories */}
        <motion.div 
          className="exercise-categories"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="category-filters">
            {exerciseCategories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <FontAwesomeIcon icon={category.icon} />
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Exercise Grid */}
        <motion.div 
          className="exercises-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {filteredExercises.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              className="exercise-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{ y: -5 }}
            >
              <div className="exercise-header">
                <h3>{exercise.title}</h3>
                <div className="exercise-meta">
                  <span 
                    className="difficulty"
                    style={{ backgroundColor: getDifficultyColor(exercise.difficulty) }}
                  >
                    {exercise.difficulty}
                  </span>
                  <span className="duration">
                    <FontAwesomeIcon icon={faClock} />
                    {formatTime(exercise.duration)}
                  </span>
                </div>
              </div>

              <p className="exercise-description">{exercise.description}</p>

              <div className="exercise-benefits">
                <h4>Benefits:</h4>
                <ul>
                  {exercise.benefits.map((benefit, i) => (
                    <li key={i}>
                      <FontAwesomeIcon icon={faCheckCircle} />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="exercise-instructions">
                <h4>Instructions:</h4>
                <ol>
                  {exercise.instructions.slice(0, 3).map((instruction, i) => (
                    <li key={i}>{instruction}</li>
                  ))}
                  {exercise.instructions.length > 3 && <li>...</li>}
                </ol>
              </div>

              <button
                className="btn btn-primary start-exercise-btn"
                onClick={() => startExercise(exercise)}
                disabled={activeExercise?.id === exercise.id && isPlaying}
              >
                <FontAwesomeIcon icon={faPlay} />
                {activeExercise?.id === exercise.id && isPlaying ? 'In Progress' : 'Start Exercise'}
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Completed Exercises */}
        {completedExercises.length > 0 && (
          <motion.section 
            className="completed-exercises"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2>Recent Completions</h2>
            <div className="completed-list">
              {completedExercises.slice(0, 5).map((exercise, index) => (
                <div key={index} className="completed-item">
                  <FontAwesomeIcon icon={faCheckCircle} className="completed-icon" />
                  <div className="completed-info">
                    <h4>{exercise.title}</h4>
                    <p>Completed {exercise.completedAt.toLocaleDateString()}</p>
                  </div>
                  <span className="completed-duration">
                    {formatTime(exercise.duration)}
                  </span>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
