import React from "react";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeart, 
  faComments, 
  faBook, 
  faBrain,
  faUsers,
  faShieldAlt,
  faClock,
  faChartLine,
  faArrowRight,
  faPlay
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

export default function Home({ user }) {
  const { t } = useTranslation();

  const features = [
    {
      icon: faComments,
      title: "AI-Powered Therapy",
      description: "24/7 access to empathetic AI counselor trained on evidence-based therapeutic techniques",
      link: "/chat"
    },
    {
      icon: faHeart,
      title: "Mood Tracking",
      description: "Track your emotional well-being with detailed mood analytics and insights",
      link: "/mood-tracker"
    },
    {
      icon: faBrain,
      title: "Mental Health Exercises",
      description: "Guided meditation, breathing exercises, and cognitive behavioral therapy tools",
      link: "/exercises"
    },
    {
      icon: faBook,
      title: "Personal Journal",
      description: "Secure, private journaling with guided prompts and reflection tools",
      link: "/journal"
    },
    {
      icon: faUsers,
      title: "Peer Support Groups",
      description: "Connect with others on similar journeys in safe, moderated community spaces",
      link: "/peer-support"
    },
    {
      icon: faShieldAlt,
      title: "Crisis Support",
      description: "Immediate access to emergency resources and crisis intervention when you need it most",
      link: "/emergency"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Users Helped", icon: faUsers },
    { number: "95%", label: "Satisfaction Rate", icon: faHeart },
    { number: "24/7", label: "Available Support", icon: faClock },
    { number: "100%", label: "Privacy Protected", icon: faShieldAlt }
  ];

  const testimonials = [
    {
      name: "Arjun K.",
      text: "WellSetu helped me through my darkest moments. The AI therapy sessions feel so natural and supportive.",
      rating: 5
    },
    {
      name: "Priya S.",
      text: "The mood tracking feature has given me incredible insights into my mental health patterns.",
      rating: 5
    },
    {
      name: "Kavya L.",
      text: "Having 24/7 access to mental health support has been life-changing for my anxiety management.",
      rating: 5
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <motion.section 
        className="hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              {t('home.heroTitle')}
              <span className="hero-accent">{t('home.heroSubtitle')}</span>
            </h1>
            <p className="hero-description">
              {t('home.heroDescription')}
            </p>
            
            {user ? (
              <div className="hero-actions">
                <Link to="/dashboard" className="btn btn-primary">
                  <FontAwesomeIcon icon={faChartLine} />
                  View Dashboard
                </Link>
                <Link to="/chat" className="btn btn-secondary">
                  <FontAwesomeIcon icon={faComments} />
                  Start Therapy Session
                </Link>
              </div>
            ) : (
              <div className="hero-actions">
                <Link to="/register" className="btn btn-primary">
                  <FontAwesomeIcon icon={faArrowRight} />
                  Get Started Free
                </Link>
                <Link to="/emergency" className="btn btn-emergency">
                  <FontAwesomeIcon icon={faHeart} />
                  Crisis Support
                </Link>
              </div>
            )}
          </div>
          
          <div className="hero-visual">
            <div className="hero-image">
              <img 
                src="/images/mental-health-hero.jpg" 
                alt="Mental Health Support"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '20px'
                }}
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <FontAwesomeIcon icon={stat.icon} className="stat-icon" />
                <h3>{stat.number}</h3>
                <p>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Comprehensive Mental Health Support</h2>
          </motion.div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="feature-icon">
                  <FontAwesomeIcon icon={feature.icon} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                {user && (
                  <Link to={feature.link} className="feature-link">
                    Try Now <FontAwesomeIcon icon={faArrowRight} />
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2>What Our Users Say</h2>
          </motion.div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="testimonial-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star">⭐</span>
                  ))}
                </div>
                <p>"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <strong>{testimonial.name}</strong>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="cta-section">
          <div className="container">
            <motion.div 
              className="cta-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2>Ready to Start Your Mental Health Journey?</h2>
              <p>Join thousands of users who have found support, healing, and hope with MindCare.</p>
              <div className="cta-actions">
                <Link to="/register" className="btn btn-primary btn-large">
                  <FontAwesomeIcon icon={faPlay} />
                  Start Your Journey
                </Link>
                <Link to="/resources" className="btn btn-outline">
                  <FontAwesomeIcon icon={faBook} />
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
