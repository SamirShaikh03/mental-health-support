import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPhone, 
  faEnvelope, 
  faMapMarkerAlt,
  faHeart,
  faShieldAlt,
  faUserMd
} from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>
            <span className="brand-icon">🧠</span>
            MindCare
          </h3>
          <p>Your trusted companion for mental health and psychological well-being.</p>
          <div className="footer-stats">
            <div className="stat">
              <FontAwesomeIcon icon={faHeart} />
              <span>10K+ Users Helped</span>
            </div>
            <div className="stat">
              <FontAwesomeIcon icon={faUserMd} />
              <span>Licensed Professionals</span>
            </div>
            <div className="stat">
              <FontAwesomeIcon icon={faShieldAlt} />
              <span>100% Confidential</span>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/resources">Resources</Link></li>
            <li><Link to="/emergency">Crisis Support</Link></li>
            <li><Link to="/chat">AI Therapy</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Emergency Contacts</h4>
          <div className="emergency-contacts">
            <div className="contact">
              <FontAwesomeIcon icon={faPhone} />
              <div>
                <strong>National Suicide Prevention Lifeline</strong>
                <span>988</span>
              </div>
            </div>
            <div className="contact">
              <FontAwesomeIcon icon={faPhone} />
              <div>
                <strong>Crisis Text Line</strong>
                <span>Text HOME to 741741</span>
              </div>
            </div>
            <div className="contact">
              <FontAwesomeIcon icon={faPhone} />
              <div>
                <strong>Emergency Services</strong>
                <span>911</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h4>Contact Info</h4>
          <div className="contact-info">
            <div className="contact-item">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <span>123 Mental Health St, Care City, HC 12345</span>
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faPhone} />
              <span>+1 (555) 123-MIND</span>
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faEnvelope} />
              <span>support@mindcare.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container">
          <p>&copy; 2025 MindCare. All rights reserved. Your mental health matters.</p>
          <div className="footer-disclaimer">
            <small>
              <strong>Disclaimer:</strong> MindCare is not a substitute for professional medical advice, 
              diagnosis, or treatment. Always seek the advice of qualified health providers with any 
              questions you may have regarding a medical condition.
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
}
