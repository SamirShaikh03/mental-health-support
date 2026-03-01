import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faLock, 
  faEye, 
  faEyeSlash,
  faGlobe,
  faShare,
  faUserGraduate,
  faShieldHalved,
  faHandHoldingHeart
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

const getRoleOptions = (t) => [
  {
    value: 'student',
    label: t('auth.roles.student'),
    icon: faUserGraduate,
    blurb: t('auth.roles.studentDesc')
  },
  {
    value: 'counselor',
    label: t('auth.roles.counselor'),
    icon: faHandHoldingHeart,
    blurb: t('auth.roles.counselorDesc')
  },
  {
    value: 'admin',
    label: t('auth.roles.admin'),
    icon: faShieldHalved,
    blurb: t('auth.roles.adminDesc')
  }
];

export default function Login({ onLogin }) {
  const { t } = useTranslation();
  const roleOptions = getRoleOptions(t);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    role: 'student'
  });
  const [showPassword, setShowPassword] = useState(false);
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

    if (!formData.email.trim()) {
      newErrors.email = t('auth.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.errors.emailInvalid');
    }
    
    if (!formData.password) {
      newErrors.password = t('auth.errors.passwordRequired');
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
      
      // For demo purposes, create a mock user
      const userData = {
        id: 1,
        name: "Demo User",
        email: formData.email,
        age: 25,
        location: "New York, NY",
        joinDate: new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=Demo+User&background=0077b6&color=fff`,
        role: formData.role
      };
      
      onLogin(userData);
      const destination = formData.role === 'admin' ? '/admin' : formData.role === 'counselor' ? '/counselor' : '/dashboard';
      navigate(destination);
    } catch (error) {
      setErrors({ submit: t('auth.errors.loginFailed') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Simulate social login
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
            <h1>{t('auth.loginTitle')}</h1>
            <p>{t('auth.loginDescription')}</p>
          </div>

          <div className="role-selector">
            <p className="role-selector-label">{t('auth.signInAs')}</p>
            <div className="role-options">
              {roleOptions.map((option) => (
                <label
                  key={option.value}
                  className={`role-option ${formData.role === option.value ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={option.value}
                    checked={formData.role === option.value}
                    onChange={handleChange}
                  />
                  <div className="role-option-body">
                    <span className="role-option-icon">
                      <FontAwesomeIcon icon={option.icon} />
                    </span>
                    <div>
                      <p className="role-option-title">{option.label}</p>
                      <p className="role-option-blurb">{option.blurb}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
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
                  placeholder={t('auth.placeholders.enterPassword')}
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

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-text">{t('auth.rememberMe')}</span>
              </label>
              <Link to="/forgot-password" className="forgot-password">
                {t('auth.forgotPassword')}
              </Link>
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
                  {t('auth.signingIn')}
                </>
              ) : (
                t('auth.loginButton')
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>{t('auth.orContinueWith')}</span>
          </div>

          <div className="social-auth">
            <button 
              type="button" 
              className="btn btn-social btn-google"
              onClick={() => handleSocialLogin('Google')}
            >
                                <FontAwesomeIcon icon={faGlobe} />
              <span>{t('auth.google')}</span>
            </button>
            <button 
              type="button" 
              className="btn btn-social btn-facebook"
              onClick={() => handleSocialLogin('Facebook')}
            >
                                <FontAwesomeIcon icon={faShare} />
              <span>{t('auth.facebook')}</span>
            </button>
          </div>

          <div className="auth-footer">
            <p>{t('auth.dontHaveAccount')} <Link to="/register">{t('auth.createOneHere')}</Link></p>
          </div>

          <div className="demo-credentials">
            <h4>{t('auth.demoCredentials')}</h4>
            <p>{t('auth.demoEmail')}</p>
            <p>{t('auth.demoPassword')}</p>
            <p className="role-hint">{t('auth.roleHint')}</p>
          </div>
        </motion.div>

        <div className="auth-side">
          <div className="auth-side-content">
            <h2>{t('auth.welcomeBack')}</h2>
            <p className="auth-side-subtitle">{t('auth.journeyContinues')}</p>
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
