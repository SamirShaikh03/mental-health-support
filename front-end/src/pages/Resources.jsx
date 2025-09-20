import React, { useState, useEffect } from 'react';
import '../index.css'; // Global styles
import '../styles.css'; // Shared styles
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain, faSearch, faPlay, faPause, faVideo, faMusic, faHeart, faLeaf } from "@fortawesome/free-solid-svg-icons";

export default function Resources() {
  const [selectedAudioCategory, setSelectedAudioCategory] = useState('meditation');
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
        src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Replace with actual audio
        description: 'Start your day with peaceful mindfulness'
      },
      {
        id: 'med-2',
        title: 'Body Scan Meditation',
        duration: '15:00',
        src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        description: 'Deep relaxation through body awareness'
      },
      {
        id: 'med-3',
        title: 'Loving Kindness Meditation',
        duration: '12:00',
        src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        description: 'Cultivate compassion and self-love'
      }
    ],
    nature: [
      {
        id: 'nat-1',
        title: 'Gentle Rain Sounds',
        duration: '30:00',
        src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        description: 'Soothing rain for relaxation and focus'
      },
      {
        id: 'nat-2',
        title: 'Ocean Waves',
        duration: '45:00',
        src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        description: 'Peaceful ocean sounds for deep calm'
      },
      {
        id: 'nat-3',
        title: 'Forest Ambience',
        duration: '60:00',
        src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        description: 'Natural forest sounds with birds'
      }
    ],
    sleep: [
      {
        id: 'slp-1',
        title: 'Deep Sleep Music',
        duration: '60:00',
        src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        description: 'Soft music for better sleep quality'
      },
      {
        id: 'slp-2',
        title: 'Progressive Muscle Relaxation',
        duration: '20:00',
        src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        description: 'Guided relaxation for tension release'
      },
      {
        id: 'slp-3',
        title: 'Sleep Stories',
        duration: '25:00',
        src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        description: 'Calming bedtime stories for adults'
      }
    ],
    breathing: [
      {
        id: 'bre-1',
        title: '4-7-8 Breathing Exercise',
        duration: '8:00',
        src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        description: 'Reduce anxiety with guided breathing'
      },
      {
        id: 'bre-2',
        title: 'Box Breathing Technique',
        duration: '10:00',
        src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        description: 'Military-style stress relief breathing'
      },
      {
        id: 'bre-3',
        title: 'Pranayama for Beginners',
        duration: '15:00',
        src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        description: 'Traditional yogic breathing practices'
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
    if (currentAudio) {
      currentAudio.pause();
    }
    
    const audio = new Audio(audioSrc);
    setCurrentAudio(audio);
    setIsPlaying(true);
    
    audio.play();
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentAudio(null);
    });
  };

  const pauseAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      setIsPlaying(false);
    }
  };
  return (
    <div className="resources-page">
      <div className="container">
        {/* Header */}
        <header className="page-header text-center mb-4">
          <h1 className="hero-text">
            <FontAwesomeIcon icon={faBrain} style={{ marginRight: "8px", color: "#6366f1" }} />
            Mental Health Resources
          </h1>
          <p className="hero-description">
            Comprehensive collection of videos, audio resources, and mental health support
          </p>
        </header>

        {/* Crisis Banner */}
        <section className="crisis-banner mb-4">
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

        {/* Hindi Videos Section */}
        <section className="video-section mb-5">
          <h2 className="section-title">
            <FontAwesomeIcon icon={faVideo} style={{ marginRight: "8px", color: "#ef4444" }} />
          Mental Health Videos in Hindi
          </h2>
          <div className="video-grid">
            {hindiVideos.map((video) => (
              <div key={video.id} className="video-card">
                <div className="video-thumbnail">
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

        {/* Audio Resources Section */}
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
                    onClick={() => isPlaying ? pauseAudio() : playAudio(audio.src, audio.id)}
                  >
                    <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
                    {isPlaying ? 'Pause' : 'Play'}
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