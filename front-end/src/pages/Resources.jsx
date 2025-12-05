import React, { useState } from 'react';
import '../index.css'; // Global styles
import '../styles.css'; // Shared styles
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from 'framer-motion';
import { faBrain, faPlay, faPause, faVideo, faMusic, faHeart, faLeaf } from "@fortawesome/free-solid-svg-icons";

export default function Resources() {
  const [selectedAudioCategory, setSelectedAudioCategory] = useState('meditation');
  const [currentAudioId, setCurrentAudioId] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Hindi Mental Health Videos
  const hindiVideos = [
    {
      id: 'hindi-1',
      title: 'मानसिक स्वास्थ्य की महत्ता - Mental Health Awareness',
      description: 'मानसिक स्वास्थ्य के बारे में जागरूकता और इसकी महत्ता',
      videoId: 'dQw4w9WgXcQ', // Replace with actual video IDs
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
    },
    {
      id: 'hindi-2',
      title: 'तनाव कम करने के उपाय - Stress Management Tips',
      description: 'दैनिक जीवन में तनाव को कम करने के प्रभावी तरीके',
      videoId: 'dQw4w9WgXcQ',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
    },
    {
      id: 'hindi-3',
      title: 'ध्यान और योग - Meditation and Yoga',
      description: 'मानसिक शांति के लिए ध्यान और योग की तकनीकें',
      videoId: 'dQw4w9WgXcQ',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
    },
    {
      id: 'hindi-4',
      title: 'अवसाद से मुकाबला - Dealing with Depression',
      description: 'अवसाद के लक्षण और इससे निपटने के तरीके',
      videoId: 'dQw4w9WgXcQ',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
    }
  ];

  // Mental Health Videos (YouTube curated list) - moved out of JSX and rendered directly
  const mentalHealthVideos = [
    {
      id: 'vid-1',
      title: 'Is there a mental health crisis among students in India?',
      description: 'Explores the rising mental health issues in Indian students.',
      videoId: 'vXCbf3HfGlQ',
      thumbnail: 'https://img.youtube.com/vi/vXCbf3HfGlQ/maxresdefault.jpg'
    },
    {
      id: 'vid-2',
      title: 'Healthy coping strategies for young people',
      description: 'Coping tools like breathing, grounding, and relaxation.',
      videoId: 'Cv2DJ9riXb4',
      thumbnail: 'https://img.youtube.com/vi/Cv2DJ9riXb4/maxresdefault.jpg'
    },
    {
      id: 'vid-3',
      title: 'Indian students’ deaths bring attention to mental health',
      description: 'Case studies and the urgent need for mental health support.',
      videoId: 'SLM6ESW_EEk',
      thumbnail: 'https://img.youtube.com/vi/SLM6ESW_EEk/maxresdefault.jpg'
    },
    {
      id: 'vid-4',
      title: 'Your Mental Health in College | Crash Course',
      description: 'Crash Course video on how to manage mental health in college life.',
      videoId: 'l_9PchV6PIc',
      thumbnail: 'https://img.youtube.com/vi/l_9PchV6PIc/maxresdefault.jpg'
    },
    {
      id: 'vid-5',
      title: "Mental Health Stigma in India - It's All In Your Head",
      description: 'Addresses stigma and myths surrounding mental health.',
      videoId: 'NiUu8mMZjEA',
      thumbnail: 'https://img.youtube.com/vi/NiUu8mMZjEA/maxresdefault.jpg'
    },
    {
      id: 'vid-6',
      title: 'Student Anxiety & Stress Management',
      description: 'Techniques to reduce anxiety and stress for students.',
      videoId: 'U7gE5mHRLcA',
      thumbnail: 'https://img.youtube.com/vi/U7gE5mHRLcA/maxresdefault.jpg'
    },
    {
      id: 'vid-7',
      title: 'How Can We Solve the College Student Mental Health Crisis?',
      description: 'Discussion on large-scale solutions and institutional support.',
      videoId: 'JEtNxNW0bRU',
      thumbnail: 'https://img.youtube.com/vi/JEtNxNW0bRU/maxresdefault.jpg'
    },
    {
      id: 'vid-8',
      title: 'Why Indian Students Are So Stressed Out',
      description: 'Explains reasons behind high stress in Indian students.',
      videoId: 'je-fc5CIG60',
      thumbnail: 'https://img.youtube.com/vi/je-fc5CIG60/maxresdefault.jpg'
    },
    {
      id: 'vid-9',
      title: 'Unspoken Minds: India’s Mental Health Crisis | Gravitas Plus',
      description: 'A deep dive into India’s mental health challenges.',
      videoId: '33pHJ_ROaiI',
      thumbnail: 'https://img.youtube.com/vi/33pHJ_ROaiI/maxresdefault.jpg'
    }
  ];

  // Audio Categories and Resources
  const audioCategories = [
    { id: 'meditation', label: 'Meditation & Mindfulness', icon: faBrain },
    { id: 'nature', label: 'Nature Sounds', icon: faLeaf },
    { id: 'sleep', label: 'Sleep & Relaxation', icon: faHeart },
    { id: 'breathing', label: 'Breathing Exercises', icon: faMusic }
  ];

  const audioResources = {
    meditation: [
      {
        id: 'med-1',
        title: 'Morning Mindfulness Meditation',
        duration: '10:00',
        src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        description: 'Start your day with peaceful mindfulness'
      },
      {
        id: 'med-2',
        title: 'Body Scan Meditation',
        duration: '15:00',
        src: 'https://www.soundjay.com/misc/sounds/wind-chimes-01.wav',
        description: 'Deep relaxation through body awareness'
      },
      {
        id: 'med-3',
        title: 'Loving Kindness Meditation',
        duration: '12:00',
        src: 'https://www.soundjay.com/buttons/sounds/button-09.wav',
        description: 'Cultivate compassion and self-love'
      }
    ],
    nature: [
      {
        id: 'nat-1',
        title: 'Gentle Rain Sounds',
        duration: '30:00',
        src: 'https://www.soundjay.com/nature/sounds/rain-02.wav',
        description: 'Soothing rain for relaxation and focus'
      },
      {
        id: 'nat-2',
        title: 'Ocean Waves',
        duration: '45:00',
        src: 'https://www.soundjay.com/nature/sounds/waves-01.wav',
        description: 'Peaceful ocean sounds for deep calm'
      },
      {
        id: 'nat-3',
        title: 'Forest Ambience',
        duration: '60:00',
        src: 'https://www.soundjay.com/nature/sounds/forest-sounds-01.wav',
        description: 'Natural forest sounds with birds'
      }
    ],
    sleep: [
      {
        id: 'slp-1',
        title: 'Deep Sleep Music',
        duration: '60:00',
        src: 'https://www.soundjay.com/misc/sounds/music-box-01.wav',
        description: 'Soft music for better sleep quality'
      },
      {
        id: 'slp-2',
        title: 'Progressive Muscle Relaxation',
        duration: '20:00',
        src: 'https://www.soundjay.com/misc/sounds/bell-ringing-01.wav',
        description: 'Guided relaxation for tension release'
      },
      {
        id: 'slp-3',
        title: 'Sleep Stories',
        duration: '25:00',
        src: 'https://www.soundjay.com/misc/sounds/wind-chimes-02.wav',
        description: 'Calming bedtime stories for adults'
      }
    ],
    breathing: [
      {
        id: 'bre-1',
        title: '4-7-8 Breathing Exercise',
        duration: '8:00',
        src: 'https://www.soundjay.com/misc/sounds/breathing-01.wav',
        description: 'Reduce anxiety with guided breathing'
      },
      {
        id: 'bre-2',
        title: 'Box Breathing Technique',
        duration: '10:00',
        src: 'https://www.soundjay.com/misc/sounds/breathing-02.wav',
        description: 'Calm your mind with structured breathing'
      },
      {
        id: 'bre-3',
        title: 'Alternate Nostril Breathing',
        duration: '12:00',
        src: 'https://www.soundjay.com/misc/sounds/breathing-03.wav',
        description: 'Balance your nervous system'
      }
    ]
  };

  // Foundation Information
  const foundationInfo = [
    {
      id: 'found-1',
      name: 'National Institute of Mental Health and Neurosciences (NIMHANS)',
      description: 'Premier institute for mental health research and treatment in India',
      contact: '+91-80-26995000',
      website: 'https://nimhans.ac.in',
      services: ['Research', 'Treatment', 'Training', 'Outreach Programs']
    },
    {
      id: 'found-2',
      name: 'The Live Love Laugh Foundation',
      description: 'Working towards mental health awareness and reducing stigma',
      contact: 'info@tlllfoundation.org',
      website: 'https://www.thelivelovelaughfoundation.org',
      services: ['Awareness Campaigns', 'Research', 'Advocacy', 'Support Programs']
    },
    {
      id: 'found-3',
      name: 'Manas Foundation',
      description: 'Promoting mental health and wellness across communities',
      contact: '+91-9820466726',
      website: 'https://www.manasfoundation.com',
      services: ['Community Programs', 'Counseling', 'Training', 'Helpline Services']
    }
  ];

  // Audio Player Functions
  const playAudio = (audioSrc, audioId) => {
    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    
    // If clicking the same audio that's already selected, toggle play/pause
    if (currentAudioId === audioId && isPlaying) {
      setIsPlaying(false);
      setCurrentAudioId(null);
      setCurrentAudio(null);
      return;
    }
    
    // Create and play new audio
    const audio = new Audio(audioSrc);
    setCurrentAudio(audio);
    setCurrentAudioId(audioId);
    setIsPlaying(true);
    
    audio.play().catch(error => {
      console.error('Audio playback failed:', error);
      setIsPlaying(false);
      setCurrentAudioId(null);
      setCurrentAudio(null);
    });
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentAudioId(null);
      setCurrentAudio(null);
    });

    audio.addEventListener('error', () => {
      console.error('Audio loading failed');
      setIsPlaying(false);
      setCurrentAudioId(null);
      setCurrentAudio(null);
    });
  };

  const pauseAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      setIsPlaying(false);
      setCurrentAudioId(null);
      setCurrentAudio(null);
    }
  };
  const scrollToCrisisSupport = () => {
    const section = document.getElementById('crisis-support');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="resources-page">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <div className="header-left">
              <h1>
                <FontAwesomeIcon icon={faBrain} className="header-icon" />
                Mental Health Resources
              </h1>
              <p>Curated videos, guided audio, and support tools to nurture your well-being.</p>
              <div className="community-stats">
                <div className="stat">
                  <FontAwesomeIcon icon={faVideo} />
                  <span>Expert-led video library</span>
                </div>
                <div className="stat">
                  <FontAwesomeIcon icon={faMusic} />
                  <span>Guided audio experiences</span>
                </div>
                <div className="stat">
                  <FontAwesomeIcon icon={faHeart} />
                  <span>Actionable self-care tools</span>
                </div>
              </div>
            </div>

            <motion.button 
              className="btn btn-primary"
              onClick={scrollToCrisisSupport}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Crisis Support
              <FontAwesomeIcon icon={faHeart} style={{ marginLeft: '8px' }} />
            </motion.button>
          </div>
        </motion.div>

        {/* Crisis Banner */}
  <section id="crisis-support" className="crisis-banner mb-4">
          <div className="crisis-content">
            <div className="crisis-info">
              <h3>🚨 Need Immediate Help?</h3>
              <p>If you're in crisis, reach out for help immediately.</p>
            </div>
            <div className="crisis-contacts">
              <div className="crisis-contact">
                <span className="contact-label">KIRAN (Govt. of India):</span>
                <span className="contact-number">1800-599-0019</span>
              </div>
              <div className="crisis-contact">
                <span className="contact-label">National Helpline:</span>
                <span className="contact-number">108</span>
              </div>
            </div>
          </div>
        </section>

        <section className="video-section mb-5">
          <h2 className="section-title">
            <FontAwesomeIcon icon={faVideo} style={{ marginRight: "8px", color: "#ef4444" }} />
            Mental Health Videos
          </h2>
          <div className="video-grid">
            {mentalHealthVideos.map((video) => (
              <div key={video.id} className="video-card">
                <div
                  className="video-thumbnail"
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${video.videoId}`, '_blank')}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => { if (e.key === 'Enter') window.open(`https://www.youtube.com/watch?v=${video.videoId}`, '_blank'); }}
                >
                  <img src={video.thumbnail} alt={video.title} />
                  <div className="play-overlay">
                    <FontAwesomeIcon icon={faPlay} className="play-icon" />
                  </div>
                </div>
                <div className="video-info">
                  <h3>{video.title}</h3>
                  <p>{video.description}</p>
                  <button
                    className="watch-btn"
                    onClick={() => window.open(`https://www.youtube.com/watch?v=${video.videoId}`, '_blank')}
                  >
                    Watch Video
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="audio-section mb-5">
          <h2 className="section-title">
            <FontAwesomeIcon icon={faMusic} style={{ marginRight: "8px", color: "#10b981" }} />
            Audio Resources - Listen & Relax
          </h2>

          {/* Audio Category Tabs */}
          <div className="audio-categories">
            {audioCategories.map((category) => (
              <button
                key={category.id}
                className={`category-tab ${selectedAudioCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedAudioCategory(category.id)}
              >
                <FontAwesomeIcon icon={category.icon} style={{ marginRight: "8px" }} />
                {category.label}
              </button>
            ))}
          </div>

          {/* Audio Players */}
          <div className="audio-grid">
            {audioResources[selectedAudioCategory]?.map((audio) => (
              <div key={audio.id} className="audio-card">
                <div className="audio-header">
                  <h3>{audio.title}</h3>
                  <span className="duration">{audio.duration}</span>
                </div>
                <p className="audio-description">{audio.description}</p>
                <div className="audio-controls">
                  <button
                    className="play-pause-btn"
                    onClick={() => (currentAudioId === audio.id && isPlaying) ? pauseAudio() : playAudio(audio.src, audio.id)}
                  >
                    <FontAwesomeIcon icon={(currentAudioId === audio.id && isPlaying) ? faPause : faPlay} />
                    {(currentAudioId === audio.id && isPlaying) ? 'Pause' : 'Play'}
                  </button>
                  <div className="audio-progress">
                    <div className="progress-bar"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Foundation Information Section */}
        <section className="foundation-section">
          <h2 className="section-title">
            <FontAwesomeIcon icon={faHeart} style={{ marginRight: "8px", color: "#f59e0b" }} />
            Mental Health Organizations & Foundations
          </h2>
          <div className="foundation-grid">
            {foundationInfo.map((foundation) => (
              <div key={foundation.id} className="foundation-card">
                <div className="foundation-header">
                  <h3>{foundation.name}</h3>
                </div>
                <p className="foundation-description">{foundation.description}</p>
                <div className="foundation-details">
                  <div className="contact-info">
                    <strong>Contact:</strong> {foundation.contact}
                  </div>
                  <div className="website-link">
                    <a href={foundation.website} target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </a>
                  </div>
                  <div className="services">
                    <strong>Services:</strong>
                    <ul>
                      {foundation.services.map((service, index) => (
                        <li key={index}>{service}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}