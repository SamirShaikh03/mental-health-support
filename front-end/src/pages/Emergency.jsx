import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExclamationTriangle, 
  faPhone, 
  faComments,
  faMapMarkerAlt,
  faHeart,
  faShieldAlt,
  faClock,
  faUserMd,
  faAmbulance,
  faGlobe,
  faHandsHelping,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

export default function Emergency() {
  const { t } = useTranslation();
  const [userLocation, setUserLocation] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('US');

  const emergencyContacts = {
    US: {
      country: 'United States',
      contacts: [
        {
          name: 'National Suicide Prevention Lifeline',
          number: '988',
          description: '24/7 free and confidential support for people in distress',
          type: 'suicide'
        },
        {
          name: 'Crisis Text Line',
          number: 'Text HOME to 741741',
          description: 'Free 24/7 support via text message',
          type: 'text'
        },
        {
          name: 'National Domestic Violence Hotline',
          number: '1-800-799-7233',
          description: '24/7 confidential support for domestic violence situations',
          type: 'domestic'
        },
        {
          name: 'SAMHSA National Helpline',
          number: '1-800-662-4357',
          description: 'Treatment referral and information service',
          type: 'treatment'
        },
        {
          name: 'Emergency Services',
          number: '911',
          description: 'Immediate emergency medical and mental health services',
          type: 'emergency'
        }
      ]
    },
    UK: {
      country: 'United Kingdom',
      contacts: [
        {
          name: 'Samaritans',
          number: '116 123',
          description: 'Free 24/7 emotional support for anyone in crisis',
          type: 'suicide'
        },
        {
          name: 'Crisis Text Line UK',
          number: 'Text SHOUT to 85258',
          description: 'Free 24/7 text support for mental health crises',
          type: 'text'
        },
        {
          name: 'Emergency Services',
          number: '999',
          description: 'Immediate emergency services',
          type: 'emergency'
        }
      ]
    },
    CA: {
      country: 'Canada',
      contacts: [
        {
          name: 'Talk Suicide Canada',
          number: '1-833-456-4566',
          description: '24/7 bilingual suicide prevention service',
          type: 'suicide'
        },
        {
          name: 'Kids Help Phone',
          number: '1-800-668-6868',
          description: '24/7 support for young people',
          type: 'youth'
        },
        {
          name: 'Emergency Services',
          number: '911',
          description: 'Immediate emergency services',
          type: 'emergency'
        }
      ]
    }
  };

  const crisisSignsData = [
    {
      category: 'Immediate Danger Signs',
      color: '#f44336',
      signs: [
        'Talking about wanting to die or kill themselves',
        'Looking for ways to kill themselves',
        'Talking about feeling hopeless or having no purpose',
        'Talking about feeling trapped or in unbearable pain',
        'Talking about being a burden to others',
        'Increasing use of alcohol or drugs',
        'Acting anxious, agitated, or reckless',
        'Sleeping too little or too much',
        'Withdrawing or feeling isolated',
        'Showing rage or talking about seeking revenge',
        'Displaying extreme mood swings'
      ]
    },
    {
      category: 'Warning Signs',
      color: '#ff9800',
      signs: [
        'Changes in eating or sleeping patterns',
        'Loss of interest in activities',
        'Difficulty concentrating',
        'Giving away prized possessions',
        'Saying goodbye to loved ones',
        'Putting affairs in order',
        'Sudden improvement after depression'
      ]
    }
  ];

  const copingStrategies = [
    {
      title: 'Grounding Techniques',
      icon: faShieldAlt,
      strategies: [
        '5-4-3-2-1 technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste',
        'Hold an ice cube or splash cold water on your face',
        'Focus on your breathing - breathe in for 4, hold for 4, out for 4',
        'Repeat a calming phrase or mantra'
      ]
    },
    {
      title: 'Immediate Safety',
      icon: faHeart,
      strategies: [
        'Remove any means of self-harm from your environment',
        'Call someone you trust - friend, family member, or counselor',
        'Go to a safe, public place',
        'Stay with someone until the crisis passes',
        'Call emergency services if in immediate danger'
      ]
    },
    {
      title: 'Reach Out',
      icon: faHandsHelping,
      strategies: [
        'Call a crisis hotline - they are free and confidential',
        'Text a crisis support service',
        'Contact your therapist or doctor',
        'Reach out to a trusted friend or family member',
        'Visit an emergency room if necessary'
      ]
    }
  ];

  const safetyPlan = [
    {
      step: 1,
      title: 'Recognize Warning Signs',
      description: 'Identify thoughts, feelings, behaviors that indicate a crisis may be developing'
    },
    {
      step: 2,
      title: 'Use Coping Strategies',
      description: 'List activities you can do alone to help yourself feel better'
    },
    {
      step: 3,
      title: 'Contact Support People',
      description: 'List people who can help distract you and provide support'
    },
    {
      step: 4,
      title: 'Contact Professionals',
      description: 'List mental health professionals and their contact information'
    },
    {
      step: 5,
      title: 'Make Environment Safe',
      description: 'Remove or limit access to potentially harmful objects or situations'
    },
    {
      step: 6,
      title: 'Emergency Contacts',
      description: 'List crisis hotlines, emergency services, and trusted individuals'
    }
  ];

  useEffect(() => {
    // Try to detect user's location for relevant emergency contacts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd use a geolocation API to determine country
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied');
        }
      );
    }
  }, []);

  const callEmergency = (number) => {
    if (number.startsWith('Text')) {
      // Open SMS app
      window.location.href = `sms:741741?body=HOME`;
    } else {
      // Open phone app
      window.location.href = `tel:${number.replace(/[^0-9]/g, '')}`;
    }
  };

  const getContactIcon = (type) => {
    switch (type) {
      case 'suicide': return faHeart;
      case 'text': return faComments;
      case 'emergency': return faAmbulance;
      case 'domestic': return faShieldAlt;
      case 'treatment': return faUserMd;
      case 'youth': return faHeart;
      default: return faPhone;
    }
  };

  const getContactColor = (type) => {
    switch (type) {
      case 'emergency': return '#f44336';
      case 'suicide': return '#e91e63';
      case 'text': return '#2196f3';
      case 'domestic': return '#9c27b0';
      case 'treatment': return '#4caf50';
      case 'youth': return '#ff9800';
      default: return '#607d8b';
    }
  };

  return (
    <div className="emergency-page">
      <div className="container">
        {/* Crisis Alert Banner */}
        <motion.div 
          className="crisis-banner"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="banner-content">
            <FontAwesomeIcon icon={faExclamationTriangle} className="warning-icon" />
            <div className="banner-text">
              <h2>{t('emergency.crisisBanner.title')}</h2>
              <p>{t('emergency.crisisBanner.description')}</p>
            </div>
            <button 
              className="emergency-btn"
              onClick={() => callEmergency('911')}
            >
              <FontAwesomeIcon icon={faAmbulance} />
              {t('emergency.crisisBanner.callEmergency')}
            </button>
          </div>
        </motion.div>

        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            {t('emergency.pageTitle')}
          </h1>
          <p>{t('emergency.pageDescription')}</p>
        </motion.div>

        {/* Emergency Contacts */}
        <motion.section 
          className="emergency-contacts"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="section-header">
            <h2>
              <FontAwesomeIcon icon={faPhone} />
              {t('emergency.emergencyContacts')}
            </h2>
            <div className="country-selector">
              <FontAwesomeIcon icon={faGlobe} />
              <select 
                value={selectedCountry} 
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
              </select>
            </div>
          </div>

          <div className="contacts-grid">
            {emergencyContacts[selectedCountry].contacts.map((contact, index) => (
              <motion.div
                key={index}
                className="contact-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <div className="contact-header">
                  <div 
                    className="contact-icon"
                    style={{ backgroundColor: getContactColor(contact.type) }}
                  >
                    <FontAwesomeIcon icon={getContactIcon(contact.type)} />
                  </div>
                  <div className="contact-info">
                    <h3>{contact.name}</h3>
                    <p className="contact-number">{contact.number}</p>
                  </div>
                </div>
                
                <p className="contact-description">{contact.description}</p>
                
                <div className="contact-actions">
                  <button 
                    className="contact-btn call"
                    onClick={() => callEmergency(contact.number)}
                  >
                    <FontAwesomeIcon icon={contact.type === 'text' ? faComments : faPhone} />
                    {contact.type === 'text' ? t('emergency.sendText') : t('emergency.callNow')}
                  </button>
                  
                  <div className="availability">
                    <FontAwesomeIcon icon={faClock} />
                    <span>{t('emergency.available247')}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Crisis Signs */}
        <motion.section 
          className="crisis-signs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2>
            <FontAwesomeIcon icon={faInfoCircle} />
            {t('emergency.crisisSigns.title')}
          </h2>
          
          <div className="signs-grid">
            {crisisSignsData.map((category, index) => (
              <div key={index} className="signs-category">
                <h3 style={{ borderColor: category.color }}>
                  <span 
                    className="category-indicator"
                    style={{ backgroundColor: category.color }}
                  />
                  {category.category}
                </h3>
                <ul>
                  {category.signs.map((sign, i) => (
                    <li key={i}>{sign}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="signs-note">
            <FontAwesomeIcon icon={faInfoCircle} />
            <p>
              {t('emergency.crisisSigns.seekHelp')}
            </p>
          </div>
        </motion.section>

        {/* Coping Strategies */}
        <motion.section 
          className="coping-strategies"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2>
            <FontAwesomeIcon icon={faHeart} />
            {t('emergency.copingStrategies.title')}
          </h2>
          
          <div className="strategies-grid">
            {copingStrategies.map((category, index) => (
              <motion.div
                key={index}
                className="strategy-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <div className="strategy-header">
                  <FontAwesomeIcon icon={category.icon} />
                  <h3>{category.title}</h3>
                </div>
                <ul>
                  {category.strategies.map((strategy, i) => (
                    <li key={i}>{strategy}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Safety Plan */}
        <motion.section 
          className="safety-plan"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2>
            <FontAwesomeIcon icon={faShieldAlt} />
            {t('emergency.safetyPlan.title')}
          </h2>
          <p>A safety plan is a personalized guide to help you navigate through difficult times.</p>
          
          <div className="safety-steps">
            {safetyPlan.map((step, index) => (
              <motion.div
                key={index}
                className="safety-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <div className="step-number">{step.step}</div>
                <div className="step-content">
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="safety-plan-cta">
            <p>{t('emergency.safetyPlan.workWith')}</p>
            <button className="btn btn-primary">
              {t('emergency.safetyPlan.download')}
            </button>
          </div>
        </motion.section>

        {/* Additional Resources */}
        <motion.section 
          className="additional-resources"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2>
            <FontAwesomeIcon icon={faHandsHelping} />
            {t('emergency.additionalResources.title')}
          </h2>
          
          <div className="resources-grid">
            <div className="resource-card">
              <h3>{t('emergency.additionalResources.professionals.title')}</h3>
              <p>{t('emergency.additionalResources.professionals.description')}</p>
              <a href="https://www.psychologytoday.com" target="_blank" rel="noopener noreferrer">
                {t('emergency.additionalResources.professionals.link')}
              </a>
            </div>
            
            <div className="resource-card">
              <h3>{t('emergency.additionalResources.supportGroups.title')}</h3>
              <p>{t('emergency.additionalResources.supportGroups.description')}</p>
              <a href="https://www.nami.org" target="_blank" rel="noopener noreferrer">
                {t('emergency.additionalResources.supportGroups.link')}
              </a>
            </div>
            
            <div className="resource-card">
              <h3>{t('emergency.additionalResources.onlineResources.title')}</h3>
              <p>{t('emergency.additionalResources.onlineResources.description')}</p>
              <a href="https://www.nimh.nih.gov" target="_blank" rel="noopener noreferrer">
                {t('emergency.additionalResources.onlineResources.link')}
              </a>
            </div>
            
            <div className="resource-card">
              <h3>{t('emergency.additionalResources.mobileApps.title')}</h3>
              <p>{t('emergency.additionalResources.mobileApps.description')}</p>
              <a href="#" onClick={(e) => e.preventDefault()}>
                {t('emergency.additionalResources.mobileApps.link')}
              </a>
            </div>
          </div>
        </motion.section>

        {/* Important Disclaimer */}
        <motion.div 
          className="disclaimer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          <div className="disclaimer-content">
            <h3>Important Information</h3>
            <p>
              If you are in immediate danger, please call emergency services (911 in the US) right away. 
              The resources on this page are meant to supplement, not replace, professional medical advice, 
              diagnosis, or treatment. Always seek the advice of qualified health providers with any questions 
              you may have regarding a medical or mental health condition.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
