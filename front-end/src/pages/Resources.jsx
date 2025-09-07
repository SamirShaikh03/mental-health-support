import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPhone, 
  faGlobe, 
  faBook, 
  faUsers, 
  faExclamationTriangle,
  faHeart,
  faSearch,
  faFilter,
  faDownload,
  faPlay,
  faHeadphones,
  faVideo,
  faGamepad,
  faMobile,
  faLaptop,
  faBookOpen,
  faPodcast,
  faCalendar,
  faMapMarkerAlt,
  faQuestionCircle,
  faInfoCircle,
  faBrain,
  faLeaf,
  faMedkit,
  faUserMd,
  faComments,
  faLifeRing,
  faClock,
  faLanguage,
  faHandHoldingHeart,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

export default function Resources() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('india');

  const categories = [
    { id: 'all', label: 'All Resources', icon: faGlobe },
    { id: 'crisis', label: 'Crisis Support', icon: faExclamationTriangle },
    { id: 'therapy', label: 'Therapy & Counseling', icon: faUserMd },
    { id: 'support-groups', label: 'Support Groups', icon: faUsers },
    { id: 'self-help', label: 'Self-Help Tools', icon: faBook },
    { id: 'apps', label: 'Mental Health Apps', icon: faMobile },
    { id: 'meditation', label: 'Meditation & Mindfulness', icon: faLeaf },
    { id: 'education', label: 'Education & Learning', icon: faBookOpen },
    { id: 'podcasts', label: 'Podcasts & Audio', icon: faPodcast },
    { id: 'communities', label: 'Online Communities', icon: faComments }
  ];

  const regions = [
    { id: 'india', label: 'India' },
    { id: 'global', label: 'Global' },
    { id: 'us', label: 'United States' },
    { id: 'canada', label: 'Canada' },
    { id: 'uk', label: 'United Kingdom' },
    { id: 'australia', label: 'Australia' },
    { id: 'international', label: 'International' }
  ];

  const resources = [
    // India Crisis Support
    {
      id: 'india-1',
      title: "AASRA - Crisis Helpline",
      description: "24/7 suicide prevention helpline providing emotional support in multiple Indian languages",
      contact: "+91-9820466726",
      website: "http://www.aasra.info",
      category: "crisis",
      region: "india",
      type: "phone",
      availability: "24/7",
      languages: ["Hindi", "English", "Marathi"],
      icon: faLifeRing,
      color: "#e74c3c"
    },
    {
      id: 'india-2',
      title: "Vandrevala Foundation Helpline",
      description: "Free 24/7 mental health support and crisis intervention helpline",
      contact: "1860-2662-345 or 1800-2333-330",
      website: "https://vandrevalafoundation.com",
      category: "crisis",
      region: "india",
      type: "phone",
      availability: "24/7",
      languages: ["Hindi", "English", "Tamil", "Telugu"],
      icon: faPhone,
      color: "#e74c3c"
    },
    {
      id: 'india-3',
      title: "iCALL - Psychosocial Helpline",
      description: "TISS psychosocial helpline for emotional support and mental health guidance",
      contact: "9152987821",
      website: "http://icallhelpline.org",
      category: "crisis",
      region: "india",
      type: "phone",
      availability: "10 AM - 8 PM",
      languages: ["Hindi", "English"],
      icon: faComments,
      color: "#e74c3c"
    },
    {
      id: 'india-4',
      title: "Manastha - Mental Health Services",
      description: "Professional mental health counseling and therapy services across India",
      website: "https://manastha.com",
      category: "therapy",
      region: "india",
      type: "platform",
      availability: "Business Hours",
      languages: ["Hindi", "English", "Regional Languages"],
      icon: faUserMd,
      color: "#3498db"
    },
    {
      id: 'india-5',
      title: "YourDOST - Student Mental Health",
      description: "Online counseling platform specifically designed for students and young professionals",
      website: "https://yourdost.com",
      category: "therapy",
      region: "india",
      type: "platform",
      availability: "24/7 Chat Support",
      languages: ["Hindi", "English"],
      icon: faBrain,
      color: "#3498db"
    },
    {
      id: 'india-6',
      title: "Mpower - Mental Health Initiative",
      description: "Comprehensive mental health services including therapy, workshops, and awareness programs",
      website: "https://mpowerminds.com",
      category: "therapy",
      region: "india",
      type: "platform",
      availability: "Business Hours",
      languages: ["Hindi", "English"],
      icon: faHeart,
      color: "#3498db"
    },
    {
      id: 'india-7',
      title: "Fortis Mental Health Program",
      description: "Professional psychiatric and psychological services across Fortis hospitals",
      website: "https://fortishealthcare.com",
      category: "therapy",
      region: "india",
      type: "hospital",
      availability: "24/7 Emergency",
      languages: ["Hindi", "English", "Regional Languages"],
      icon: faUserMd,
      color: "#3498db"
    },
    {
      id: 'india-8',
      title: "InnerHour - Self-Help App",
      description: "AI-powered mental health app with therapy sessions, mood tracking, and mindfulness exercises",
      website: "https://theinnerhour.com",
      category: "apps",
      region: "india",
      type: "mobile",
      availability: "24/7",
      languages: ["Hindi", "English"],
      icon: faMobile,
      color: "#9b59b6"
    },
    {
      id: 'india-9',
      title: "Headspace India",
      description: "Meditation and mindfulness app with content specifically curated for Indian users",
      website: "https://headspace.com",
      category: "meditation",
      region: "india",
      type: "mobile",
      availability: "24/7",
      languages: ["Hindi", "English"],
      icon: faLeaf,
      color: "#2ecc71"
    },
    {
      id: 'india-10',
      title: "National Institute of Mental Health (NIMHANS)",
      description: "Premier institute for mental health research, education, and treatment",
      contact: "+91-80-26995000",
      website: "https://nimhans.ac.in",
      category: "therapy",
      region: "india",
      type: "hospital",
      availability: "24/7 Emergency",
      languages: ["Hindi", "English", "Kannada"],
      icon: faUserMd,
      color: "#3498db"
    },
    
    // Crisis Support (Other Regions)
    {
      id: 1,
      title: "National Suicide Prevention Lifeline",
      description: "24/7, free and confidential support for people in distress, prevention and crisis resources",
      contact: "988 or 1-800-273-8255",
      website: "https://suicidepreventionlifeline.org",
      category: "crisis",
      region: "us",
      type: "phone",
      availability: "24/7",
      languages: ["English", "Spanish"],
      icon: faLifeRing,
      color: "#e74c3c"
    },
    {
      id: 2,
      title: "Crisis Text Line",
      description: "Free, 24/7 crisis counseling via text message from anywhere in the US",
      contact: "Text HOME to 741741",
      website: "https://crisistextline.org",
      category: "crisis",
      region: "us",
      type: "text",
      availability: "24/7",
      languages: ["English", "Spanish"],
      icon: faComments,
      color: "#e74c3c"
    },
    {
      id: 3,
      title: "International Association for Suicide Prevention",
      description: "Global directory of crisis centers and helplines worldwide",
      website: "https://iasp.info/resources/Crisis_Centres",
      category: "crisis",
      region: "international",
      type: "directory",
      availability: "Varies by location",
      languages: ["Multiple"],
      icon: faGlobe,
      color: "#e74c3c"
    },
    {
      id: 4,
      title: "Samaritans",
      description: "Free support for anyone in emotional distress, struggling to cope, or at risk of suicide",
      contact: "116 123",
      website: "https://samaritans.org",
      category: "crisis",
      region: "uk",
      type: "phone",
      availability: "24/7",
      languages: ["English"],
      icon: faPhone,
      color: "#e74c3c"
    },

    // Therapy & Counseling
    {
      id: 5,
      title: "BetterHelp",
      description: "Online counseling and therapy with licensed professionals",
      website: "https://betterhelp.com",
      category: "therapy",
      region: "global",
      type: "online",
      availability: "Flexible scheduling",
      languages: ["English", "Spanish"],
      pricing: "Subscription-based",
      icon: faVideo,
      color: "#3498db"
    },
    {
      id: 6,
      title: "Talkspace",
      description: "Text, voice, and video therapy sessions with licensed therapists",
      website: "https://talkspace.com",
      category: "therapy",
      region: "us",
      type: "online",
      availability: "Flexible scheduling",
      languages: ["English"],
      pricing: "Subscription-based",
      icon: faComments,
      color: "#3498db"
    },
    {
      id: 7,
      title: "Psychology Today Therapist Directory",
      description: "Find local therapists, psychiatrists, and mental health professionals",
      website: "https://psychologytoday.com",
      category: "therapy",
      region: "global",
      type: "directory",
      availability: "Varies by provider",
      languages: ["Multiple"],
      icon: faUserMd,
      color: "#3498db"
    },

    // Support Groups
    {
      id: 8,
      title: "NAMI Support Groups",
      description: "Free support groups for individuals and families affected by mental illness",
      website: "https://nami.org/Support-Education/Support-Groups",
      contact: "1-800-950-6264",
      category: "support-groups",
      region: "us",
      type: "in-person",
      availability: "Regular meetings",
      languages: ["English"],
      icon: faUsers,
      color: "#9b59b6"
    },
    {
      id: 9,
      title: "Depression and Bipolar Support Alliance",
      description: "Peer-led support groups for mood disorders",
      website: "https://dbsalliance.org",
      category: "support-groups",
      region: "us",
      type: "both",
      availability: "Regular meetings",
      languages: ["English"],
      icon: faHeart,
      color: "#9b59b6"
    },
    {
      id: 10,
      title: "7 Cups",
      description: "Free emotional support through online chat with trained listeners",
      website: "https://7cups.com",
      category: "support-groups",
      region: "global",
      type: "online",
      availability: "24/7",
      languages: ["Multiple"],
      icon: faComments,
      color: "#9b59b6"
    },

    // Self-Help Tools
    {
      id: 11,
      title: "MindTools",
      description: "Practical skills for better mental health and stress management",
      website: "https://mindtools.com",
      category: "self-help",
      region: "global",
      type: "website",
      availability: "Always available",
      languages: ["English"],
      icon: faBrain,
      color: "#f39c12"
    },
    {
      id: 12,
      title: "Mood Meter",
      description: "Emotional intelligence app to recognize, understand, and regulate emotions",
      website: "https://moodmeterapp.com",
      category: "self-help",
      region: "global",
      type: "app",
      availability: "Always available",
      languages: ["English"],
      icon: faHeart,
      color: "#f39c12"
    },

    // Mental Health Apps
    {
      id: 13,
      title: "Headspace",
      description: "Meditation and mindfulness app with guided sessions for mental wellness",
      website: "https://headspace.com",
      category: "apps",
      region: "global",
      type: "app",
      availability: "Always available",
      languages: ["Multiple"],
      pricing: "Freemium",
      icon: faLeaf,
      color: "#2ecc71"
    },
    {
      id: 14,
      title: "Calm",
      description: "Sleep stories, meditation, and relaxation techniques",
      website: "https://calm.com",
      category: "apps",
      region: "global",
      type: "app",
      availability: "Always available",
      languages: ["Multiple"],
      pricing: "Freemium",
      icon: faLeaf,
      color: "#2ecc71"
    },
    {
      id: 15,
      title: "Youper",
      description: "AI-powered emotional health assistant for mood tracking and CBT",
      website: "https://youper.ai",
      category: "apps",
      region: "global",
      type: "app",
      availability: "Always available",
      languages: ["English"],
      pricing: "Freemium",
      icon: faBrain,
      color: "#2ecc71"
    },
    {
      id: 16,
      title: "Sanvello",
      description: "Anxiety and mood tracking with coping tools and peer support",
      website: "https://sanvello.com",
      category: "apps",
      region: "global",
      type: "app",
      availability: "Always available",
      languages: ["English"],
      pricing: "Freemium",
      icon: faShieldAlt,
      color: "#2ecc71"
    },

    // Meditation & Mindfulness
    {
      id: 17,
      title: "Insight Timer",
      description: "Free meditation app with thousands of guided meditations",
      website: "https://insighttimer.com",
      category: "meditation",
      region: "global",
      type: "app",
      availability: "Always available",
      languages: ["Multiple"],
      pricing: "Freemium",
      icon: faLeaf,
      color: "#27ae60"
    },
    {
      id: 18,
      title: "UCLA Mindful Awareness Research Center",
      description: "Free guided meditations and mindfulness resources",
      website: "https://marc.ucla.edu",
      category: "meditation",
      region: "global",
      type: "website",
      availability: "Always available",
      languages: ["English"],
      icon: faBrain,
      color: "#27ae60"
    },

    // Education & Learning
    {
      id: 19,
      title: "Mental Health America",
      description: "Comprehensive mental health information and screening tools",
      website: "https://mhanational.org",
      category: "education",
      region: "us",
      type: "website",
      availability: "Always available",
      languages: ["English", "Spanish"],
      icon: faBookOpen,
      color: "#34495e"
    },
    {
      id: 20,
      title: "NIMH - National Institute of Mental Health",
      description: "Research-based information about mental health conditions and treatments",
      website: "https://nimh.nih.gov",
      category: "education",
      region: "us",
      type: "website",
      availability: "Always available",
      languages: ["English", "Spanish"],
      icon: faBook,
      color: "#34495e"
    },

    // Podcasts & Audio
    {
      id: 21,
      title: "The Mental Illness Happy Hour",
      description: "Honest conversations about mental health struggles and triumphs",
      website: "https://mentalpod.com",
      category: "podcasts",
      region: "global",
      type: "podcast",
      availability: "Weekly episodes",
      languages: ["English"],
      icon: faPodcast,
      color: "#8e44ad"
    },
    {
      id: 22,
      title: "Therapy for Black Girls Podcast",
      description: "Mental health discussions relevant to Black women and girls",
      website: "https://therapyforblackgirls.com",
      category: "podcasts",
      region: "global",
      type: "podcast",
      availability: "Weekly episodes",
      languages: ["English"],
      icon: faPodcast,
      color: "#8e44ad"
    },

    // Online Communities
    {
      id: 23,
      title: "Reddit Mental Health Communities",
      description: "Supportive communities for various mental health conditions",
      website: "https://reddit.com/r/mentalhealth",
      category: "communities",
      region: "global",
      type: "forum",
      availability: "Always active",
      languages: ["Multiple"],
      icon: faComments,
      color: "#e67e22"
    },
    {
      id: 24,
      title: "18percent",
      description: "Diverse community for people dealing with anxiety",
      website: "https://18percent.org",
      category: "communities",
      region: "global",
      type: "forum",
      availability: "Always active",
      languages: ["English"],
      icon: faUsers,
      color: "#e67e22"
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesRegion = selectedRegion === 'global' || resource.region === selectedRegion || resource.region === 'global';
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesRegion && matchesSearch;
  });

  const getTypeDisplay = (type) => {
    const types = {
      phone: { label: 'Phone Support', icon: faPhone },
      text: { label: 'Text Support', icon: faComments },
      online: { label: 'Online Service', icon: faGlobe },
      app: { label: 'Mobile App', icon: faMobile },
      website: { label: 'Website', icon: faLaptop },
      directory: { label: 'Directory', icon: faBook },
      'in-person': { label: 'In-Person', icon: faMapMarkerAlt },
      both: { label: 'Online & In-Person', icon: faUsers },
      podcast: { label: 'Podcast', icon: faPodcast },
      forum: { label: 'Community Forum', icon: faComments }
    };
    return types[type] || { label: type, icon: faQuestionCircle };
  };

  return (
    <div className="resources-page">
      <div className="container">
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <h1>
              <FontAwesomeIcon icon={faHeart} />
              Mental Health Resources
            </h1>
            <p>Comprehensive collection of mental health support, tools, and educational resources</p>
          </div>
        </motion.div>

        {/* Quick Access - Crisis Resources */}
        <motion.section 
          className="crisis-banner"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="crisis-content">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <div className="crisis-info">
              <h3>Need Immediate Help?</h3>
              <p>If you're in crisis or having thoughts of suicide, reach out for help immediately.</p>
            </div>
            <div className="crisis-contacts">
              <div className="crisis-contact">
                <span className="contact-label">US:</span>
                <span className="contact-number">988</span>
              </div>
              <div className="crisis-contact">
                <span className="contact-label">Text:</span>
                <span className="contact-number">741741</span>
              </div>
              <div className="crisis-contact">
                <span className="contact-label">UK:</span>
                <span className="contact-number">116 123</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Filters and Search */}
        <motion.section 
          className="resources-filters"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-selects">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="region-filter"
            >
              {regions.map(region => (
                <option key={region.id} value={region.id}>{region.label}</option>
              ))}
            </select>
          </div>
        </motion.section>

        {/* Category Navigation */}
        <motion.section 
          className="category-nav"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="category-buttons">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <FontAwesomeIcon icon={category.icon} />
                <span>{category.label}</span>
                <span className="count">
                  {resources.filter(r => category.id === 'all' || r.category === category.id).length}
                </span>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Resources Grid */}
        <motion.section 
          className="resources-grid-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="section-header">
            <h2>
              {categories.find(c => c.id === selectedCategory)?.label || 'All Resources'}
              <span className="resource-count">({filteredResources.length} resources)</span>
            </h2>
          </div>

          <div className="resources-grid">
            <AnimatePresence>
              {filteredResources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  className="resource-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: 0.05 * index }}
                  whileHover={{ y: -5 }}
                  style={{ borderLeftColor: resource.color }}
                >
                  <div className="resource-header">
                    <div className="resource-icon" style={{ backgroundColor: resource.color }}>
                      <FontAwesomeIcon icon={resource.icon} />
                    </div>
                    
                    <div className="resource-main">
                      <h3>{resource.title}</h3>
                      <p className="resource-description">{resource.description}</p>
                    </div>
                  </div>

                  <div className="resource-details">
                    <div className="resource-meta">
                      <div className="meta-item">
                        <FontAwesomeIcon icon={getTypeDisplay(resource.type).icon} />
                        <span>{getTypeDisplay(resource.type).label}</span>
                      </div>
                      
                      {resource.availability && (
                        <div className="meta-item">
                          <FontAwesomeIcon icon={faClock} />
                          <span>{resource.availability}</span>
                        </div>
                      )}
                      
                      {resource.languages && (
                        <div className="meta-item">
                          <FontAwesomeIcon icon={faLanguage} />
                          <span>{resource.languages.join(', ')}</span>
                        </div>
                      )}
                      
                      {resource.pricing && (
                        <div className="meta-item pricing">
                          <span>{resource.pricing}</span>
                        </div>
                      )}
                    </div>

                    <div className="resource-contact">
                      {resource.contact && (
                        <div className="contact-info">
                          <FontAwesomeIcon icon={faPhone} />
                          <span>{resource.contact}</span>
                        </div>
                      )}
                      
                      {resource.website && (
                        <a 
                          href={resource.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="website-link"
                        >
                          <FontAwesomeIcon icon={faGlobe} />
                          Visit Website
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="resource-category-badge" style={{ backgroundColor: resource.color }}>
                    {categories.find(c => c.id === resource.category)?.label}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredResources.length === 0 && (
            <div className="no-resources">
              <FontAwesomeIcon icon={faInfoCircle} size="3x" />
              <h3>No resources found</h3>
              <p>Try adjusting your filters or search terms to find relevant resources.</p>
            </div>
          )}
        </motion.section>

        {/* Additional Information */}
        <motion.section 
          className="resource-info"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="info-cards">
            <div className="info-card">
              <FontAwesomeIcon icon={faShieldAlt} />
              <h3>Privacy & Safety</h3>
              <p>Most crisis lines and support services maintain strict confidentiality. However, they may need to break confidentiality if there's an immediate risk to your safety or the safety of others.</p>
            </div>
            
            <div className="info-card">
              <FontAwesomeIcon icon={faHandHoldingHeart} />
              <h3>Finding the Right Support</h3>
              <p>Different types of support work for different people. Don't hesitate to try multiple resources to find what works best for your specific needs and situation.</p>
            </div>
            
            <div className="info-card">
              <FontAwesomeIcon icon={faInfoCircle} />
              <h3>Professional Help</h3>
              <p>While these resources provide valuable support, they don't replace professional mental health treatment. Consider consulting with a mental health professional for ongoing care.</p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
