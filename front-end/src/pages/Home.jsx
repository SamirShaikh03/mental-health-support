import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeart, 
  faComments, 
  faBook, 
  faBrain,
  faCalendarAlt,
  faUsers,
  faShieldAlt,
  faClock,
  faChartLine,
  faArrowRight,
  faPlay,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

export default function Home({ user }) {
  const { t } = useTranslation();
  const [theme, setTheme] = useState('light');
  const location = useLocation();

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    const resolveTheme = () => {
      const current = root.getAttribute('data-theme');
      if (current) {
        return current;
      }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    };

    const applyTheme = () => {
      setTheme(resolveTheme());
    };

    applyTheme();

    // Observe theme attribute changes so the hero image swaps instantly.
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          applyTheme();
        }
      });
    });

    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    if (location.hash === '#hero' || location.state?.scrollToHero) {
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const heroImageSrc = `${process.env.PUBLIC_URL}/images/${theme === 'dark' ? 'mental-health-hero5.png' : 'mental-health-hero4.png'}`;

  const features = [
    {
      icon: faComments,
      title: "AI Chat",
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

  const appointmentHighlights = [
    "Match with licensed therapists specialized in collegiate wellbeing",
    "Blend in-person, virtual, and asynchronous follow-ups in one flow",
    "Enterprise-grade encryption keeps every clinical note private"
  ];

  const experienceHighlights = [
    {
      icon: faUsers,
      title: "Peer Support Collective",
      description: "Curated circles with moderators, escalation paths, and signal monitoring keep every space supportive.",
      points: [
        "Role-based rooms for students, caregivers, and alumni mentors",
        "Live facilitation dashboard for counselors to intervene early",
        "Community health scorecards updated every 24 hours"
      ]
    },
    {
      icon: faChartLine,
      title: "Executive Dashboard",
      description: "An enterprise command center that surfaces readiness, risk, and engagement KPIs in real time.",
      points: [
        "C-suite reporting with exportable compliance snapshots",
        "AI trend detection across screenings, sessions, and journals",
        "Granular access controls for HR, wellbeing, and clinician leads"
      ]
    }
  ];

  const heroHighlights = [
    {
      icon: faComments,
      title: "Compassionate AI guidance",
      description: "Conversations that mirror the empathy of a trained counselor."
    },
    {
      icon: faClock,
      title: "Micro-practices that fit",
      description: "Feel the shift with calming check-ins in under five minutes."
    },
    {
      icon: faUsers,
      title: "Mentors who understand",
      description: "Progress alongside a moderated peer community cheering for you."
    }
  ];

  const heroMeta = [
    { icon: faHeart, title: "Community trust", detail: "10k+ calm check-ins completed" },
    { icon: faCalendarAlt, title: "Adaptive plans", detail: "Personal routines that evolve with you" },
    { icon: faShieldAlt, title: "Privacy first", detail: "Safeguarded with enterprise-grade security" }
  ];

  const operationsMetrics = [
    { label: "Avg. first response", value: "1m 42s", detail: "Measured across chat and SMS" },
    { label: "Resolved in 1 touch", value: "82%", detail: "Needs closed without escalation" },
    { label: "Specialist handoffs", value: "< 12 min", detail: "Fastest path to licensed care" }
  ];

  const operationsPillars = [
    {
      icon: faShieldAlt,
      title: "Stability & Safeguards",
      description: "Layered safeguards spot crisis signals early and guide the right protocol in seconds.",
      points: [
        "Live policy playbooks embedded in every workflow",
        "Escalation ladders monitored by duty clinicians",
        "Audit-ready transcripts with privacy redaction"
      ]
    },
    {
      icon: faUsers,
      title: "Coordinated Care Pods",
      description: "Blend AI, mentors, and clinicians into pods that stay with the member from first check-in to follow-up.",
      points: [
        "Role-aware tasking for mentors, HR, and therapists",
        "Every touchpoint synced to the same care plan",
        "Retention nudges tied to wellbeing milestones"
      ]
    },
    {
      icon: faChartLine,
      title: "Executive-ready Intelligence",
      description: "Surface participation, risk, and capacity signals leaders need to keep communities resilient.",
      points: [
        "Live occupancy and waitlist visibility",
        "Engagement cohorts with anonymized benchmarks",
        "Weekly readiness score auto-shared with leadership"
      ]
    }
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
        <motion.section
          id="hero"
          className="hero-wrapper"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="container">
            <div className="hero-content">
          <div className="hero-copy">
            <span className="hero-eyebrow">
              <FontAwesomeIcon icon={faHeart} /> Gentle support, whenever you need it
            </span>
            <div className="hero-title">
              <h1>
            {t('home.heroTitle')} <span className="hero-accent">{t('home.heroSubtitle')}</span>
              </h1>
              <p>{t('home.heroDescription')}</p>
            </div>

            <div className="hero-cta-group">
              {user ? (
            <>
              <Link to="/dashboard" className="btn btn-primary btn-large">
                <FontAwesomeIcon icon={faChartLine} /> View Dashboard
              </Link>
              <Link to="/chat" className="btn btn-outline btn-large">
                <FontAwesomeIcon icon={faComments} /> Open Calm Space
              </Link>
            </>
              ) : (
            <>
              <Link to="/register" className="btn btn-primary btn-large">
                <FontAwesomeIcon icon={faArrowRight} /> Get Started Free
              </Link>
              <Link to="/resources" className="btn btn-outline btn-large">
                <FontAwesomeIcon icon={faBook} /> Explore Guided Resources
              </Link>
            </>
              )}
            </div>
          </div>

          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            aria-hidden="false"
          >
            {/* Use public folder: /images/... or process.env.PUBLIC_URL */}
            <img
              src={heroImageSrc}
              alt="Calm support illustration"
              className="hero-image"
              loading="lazy"
              style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
            />
          </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Operations Section */}
      <section className="operations-section">
        <div className="container">
          <div className="operations-header">
            <span className="operations-kicker">Operational clarity</span>
            <h2>Care operations that stay steady under pressure</h2>
            <p>
              Keep every conversation, escalation, and follow-up aligned with the policies, people, and protections your community expects.
            </p>
          </div>

          <div className="operations-content">
            <div className="operations-metrics">
              {operationsMetrics.map((metric) => (
                <div className="operations-metric" key={metric.label}>
                  <span className="metric-label">{metric.label}</span>
                  <strong>{metric.value}</strong>
                  <p>{metric.detail}</p>
                </div>
              ))}
            </div>

            <div className="operations-pillars">
              {operationsPillars.map((pillar) => (
                <div className="operations-card" key={pillar.title}>
                  <div className="operations-icon">
                    <FontAwesomeIcon icon={pillar.icon} />
                  </div>
                  <div className="operations-card-body">
                    <h3>{pillar.title}</h3>
                    <p>{pillar.description}</p>
                    <ul>
                      {pillar.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="stat-card floating"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                viewport={{ once: true, amount: 0.4 }}
              >
                <FontAwesomeIcon icon={stat.icon} className="stat-icon" />
                <h3>{stat.number}</h3>
                <p>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment + Enterprise Experience Section */}
      <section className="appointment-section">
        <div className="container">
          <div className="appointment-grid">
            <motion.div 
              className="appointment-content"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.4 }}
            >
              <span className="appointment-kicker">Clinical access</span>
              <h2>Book an appointment in under two minutes</h2>
              <p>
                Secure a session with our licensed care team, coordinate follow-ups, and share care summaries with mentors or HR partners without leaving the platform.
              </p>
              <ul className="appointment-highlights">
                {appointmentHighlights.map((item) => (
                  <li key={item}>
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="appointment-actions">
                <Link to="/appointments" className="btn btn-primary btn-large">
                  <FontAwesomeIcon icon={faCalendarAlt} /> Book an appointment
                </Link>
                <Link to="/resources" className="btn btn-outline">
                  View clinician roster
                </Link>
              </div>
            </motion.div>

            <motion.div 
              className="experience-grid"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true, amount: 0.4 }}
            >
              {experienceHighlights.map((card) => (
                <div className="experience-card" key={card.title}>
                  <div className="experience-icon">
                    <FontAwesomeIcon icon={card.icon} />
                  </div>
                  <div className="experience-copy">
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    <ul>
                      {card.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.4 }}
          >
            <h2>Comprehensive Mental Health Support</h2>
          </motion.div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="feature-card floating"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.35 }}
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
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.35 }}
          >
            <h2>What Our Users Say</h2>
          </motion.div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="testimonial-card floating"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
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
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.4 }}
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
