import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>
            <span className="brand-icon">🧠</span>
            {t('footer.brandName')}
          </h3>
          <p>{t('footer.brandDescription')}</p>
          <div className="footer-stats">
            <div className="stat">
              <FontAwesomeIcon icon={faHeart} />
              <span>{t('footer.stats.usersHelped')}</span>
            </div>
            <div className="stat">
              <FontAwesomeIcon icon={faUserMd} />
              <span>{t('footer.stats.licensed')}</span>
            </div>
            <div className="stat">
              <FontAwesomeIcon icon={faShieldAlt} />
              <span>{t('footer.stats.confidential')}</span>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h4>{t('footer.quickLinks')}</h4>
          <ul>
            <li><Link to="/">{t('footer.home')}</Link></li>
            <li><Link to="/resources">{t('footer.resources')}</Link></li>
            <li><Link to="/emergency">{t('footer.crisisSupport')}</Link></li>
            <li><Link to="/chat">{t('footer.aiTherapy')}</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>{t('footer.support')}</h4>
          <ul>
            <li><a href="/privacy">{t('footer.privacyPolicy')}</a></li>
            <li><a href="/terms">{t('footer.termsOfService')}</a></li>
            <li><a href="/faq">{t('footer.faq')}</a></li>
            <li><a href="/contact">{t('footer.contactUs')}</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>{t('footer.emergencyContacts')}</h4>
          <div className="emergency-contacts">
            <div className="contact">
              <FontAwesomeIcon icon={faPhone} />
              <div>
                <strong>{t('footer.nationalSuicidePrevention')}</strong>
                <span>{t('footer.suicideNumber')}</span>
              </div>
            </div>
            <div className="contact">
              <FontAwesomeIcon icon={faPhone} />
              <div>
                <strong>{t('footer.crisisTextLine')}</strong>
                <span>{t('footer.crisisText')}</span>
              </div>
            </div>
            <div className="contact">
              <FontAwesomeIcon icon={faPhone} />
              <div>
                <strong>{t('footer.emergencyServices')}</strong>
                <span>{t('footer.emergencyNumber')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h4>{t('footer.contactInfo')}</h4>
          <div className="contact-info">
            <div className="contact-item">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <span>Gate 1200, Domkhel Road, Pune 412207</span>
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faPhone} />
              <span>+91 987654321</span>
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faEnvelope} />
              <span>support@wellsetu.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container">
          <p>{t('footer.copyright')}</p>
          <div className="footer-disclaimer">
            <small>
              <strong>Disclaimer:</strong> {t('footer.disclaimer')}
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
}
