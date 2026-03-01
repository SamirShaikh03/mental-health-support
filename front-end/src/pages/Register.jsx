import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faLock, 
  faEye, 
  faEyeSlash,
  faCalendar,
  faMapMarkerAlt,
  faGlobe,
  faShare
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

export default function Register({ onLogin }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    location: '',
    emergencyContact: '',
    emergencyPhone: '',
    agreedToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = t('auth.errors.firstNameRequired');
    if (!formData.lastName.trim()) newErrors.lastName = t('auth.errors.lastNameRequired');
    if (!formData.email.trim()) {
      newErrors.email = t('auth.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.errors.emailInvalid');
    }
    
    if (!formData.password) {
      newErrors.password = t('auth.errors.passwordRequired');
    } else if (formData.password.length < 8) {
      newErrors.password = t('auth.errors.passwordLength');
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.errors.passwordMismatch');
    }
    
    if (!formData.age) {
      newErrors.age = t('auth.errors.ageRequired');
    } else if (formData.age < 13) {
      newErrors.age = t('auth.errors.ageMinimum');
    }
    
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = t('auth.errors.termsRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = {
        id: Date.now(),
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        age: formData.age,
        location: formData.location,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        joinDate: new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=0077b6&color=fff`,
        role: 'student'
      };
      
      onLogin(userData);
      navigate('/dashboard');
    } catch (error) {
      setErrors({ submit: t('auth.errors.registerFailed') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = (provider) => {
    // Simulate social signup
    const userData = {
      id: Date.now(),
      name: `${provider} User`,
      email: `user@${provider.toLowerCase()}.com`,
      age: 25,
      location: "New York, NY",
      joinDate: new Date().toISOString(),
      avatar: `https://ui-avatars.com/api/?name=${provider}+User&background=0077b6&color=fff`,
      role: 'student'
    };
    
    onLogin(userData);
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <motion.div 
          className="auth-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="auth-header">
            <h1>{t('auth.registerTitle')}</h1>
            <p>{t('auth.registerDescription')}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">{t('auth.firstName')}</label>
                <div className="input-group">
                  <FontAwesomeIcon icon={faUser} className="input-icon" />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder={t('auth.placeholders.enterFirstName')}
                    className={errors.firstName ? 'error' : ''}
                  />
                </div>
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">{t('auth.lastName')}</label>
                <div className="input-group">
                  <FontAwesomeIcon icon={faUser} className="input-icon" />
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder={t('auth.placeholders.enterLastName')}
                    className={errors.lastName ? 'error' : ''}
                  />
                </div>
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">{t('auth.email')}</label>
              <div className="input-group">
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('auth.placeholders.enterEmail')}
                  className={errors.email ? 'error' : ''}
                />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">{t('auth.password')}</label>
                <div className="input-group">
                  <FontAwesomeIcon icon={faLock} className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t('auth.placeholders.createPassword')}
                    className={errors.password ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">{t('auth.confirmPassword')}</label>
                <div className="input-group">
                  <FontAwesomeIcon icon={faLock} className="input-icon" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={t('auth.placeholders.confirmPassword')}
                    className={errors.confirmPassword ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">{t('auth.age')}</label>
                <div className="input-group">
                  <FontAwesomeIcon icon={faCalendar} className="input-icon" />
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder={t('auth.placeholders.yourAge')}
                    min="13"
                    max="120"
                    className={errors.age ? 'error' : ''}
                  />
                </div>
                {errors.age && <span className="error-message">{errors.age}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="location">{t('auth.location')}</label>
                <div className="input-group">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="input-icon" />
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder={t('auth.placeholders.cityState')}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="emergencyContact">{t('auth.emergencyContactName')}</label>
              <div className="input-group">
                <FontAwesomeIcon icon={faUser} className="input-icon" />
                <input
                  type="text"
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder={t('auth.placeholders.emergencyName')}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="emergencyPhone">{t('auth.emergencyContactPhone')}</label>
              <div className="input-group">
                <FontAwesomeIcon icon={faUser} className="input-icon" />
                <input
                  type="tel"
                  id="emergencyPhone"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  placeholder={t('auth.placeholders.emergencyPhone')}
                />
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleChange}
                  className={errors.agreedToTerms ? 'error' : ''}
                />
                <span className="checkmark"></span>
                <span className="checkbox-text">
                  {t('auth.termsAgree')} <Link to="/terms">{t('auth.termsOfService')}</Link> {t('auth.and')} <Link to="/privacy">{t('auth.privacyPolicy')}</Link>
                </span>
              </label>
              {errors.agreedToTerms && <span className="error-message">{errors.agreedToTerms}</span>}
            </div>

            {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner small"></div>
                  {t('auth.creatingAccount')}
                </>
              ) : (
                t('auth.registerButton')
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>{t('auth.orSignUpWith')}</span>
          </div>

          <div className="social-auth">
            <button 
              type="button" 
              className="btn btn-social btn-google"
              onClick={() => handleSocialSignup('Google')}
            >
              <FontAwesomeIcon icon={faGlobe} />
              <span>{t('auth.google')}</span>
            </button>
            <button 
              type="button" 
              className="btn btn-social btn-facebook"
              onClick={() => handleSocialSignup('Facebook')}
            >
              <FontAwesomeIcon icon={faShare} />
              <span>{t('auth.facebook')}</span>
            </button>
          </div>

          <div className="auth-footer">
            <p>{t('auth.alreadyHaveAccount')} <Link to="/login">{t('auth.signInHere')}</Link></p>
          </div>
        </motion.div>

        <div className="auth-side">
          <div className="auth-side-content">
            <h2>{t('auth.joinToday')}</h2>
            <p className="auth-side-subtitle">{t('auth.startJourney')}</p>
            <div className="benefits">
              <div className="benefit">
                <span className="benefit-icon">🧠</span>
                <span>{t('auth.benefits.aiSupport')}</span>
              </div>
              <div className="benefit">
                <span className="benefit-icon">📊</span>
                <span>{t('auth.benefits.trackProgress')}</span>
              </div>
              <div className="benefit">
                <span className="benefit-icon">🔒</span>
                <span>{t('auth.benefits.privateSecure')}</span>
              </div>
              <div className="benefit">
                <span className="benefit-icon">🌟</span>
                <span>{t('auth.benefits.evidenceBased')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
