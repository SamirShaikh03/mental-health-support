import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faLock, 
  faEye, 
  faEyeSlash,
  faGlobe,
  faShare
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
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
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
        avatar: `https://ui-avatars.com/api/?name=Demo+User&background=0077b6&color=fff`
      };
      
      onLogin(userData);
      navigate('/dashboard');
    } catch (error) {
      setErrors({ submit: 'Invalid email or password. Please try again.' });
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
      avatar: `https://ui-avatars.com/api/?name=${provider}+User&background=0077b6&color=fff`
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
            <h1>Welcome Back</h1>
            <p>Sign in to continue your mental wellness journey</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-group">
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={errors.email ? 'error' : ''}
                />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-group">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
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
                <span className="checkbox-text">Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
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
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <div className="social-auth">
            <button 
              type="button" 
              className="btn btn-social btn-google"
              onClick={() => handleSocialLogin('Google')}
            >
                                <FontAwesomeIcon icon={faGlobe} />
              <span>Google</span>
            </button>
            <button 
              type="button" 
              className="btn btn-social btn-facebook"
              onClick={() => handleSocialLogin('Facebook')}
            >
                                <FontAwesomeIcon icon={faShare} />
              <span>Facebook</span>
            </button>
          </div>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Create one here</Link></p>
          </div>

          <div className="demo-credentials">
            <h4>Demo Credentials</h4>
            <p>Email: demo@mindcare.com</p>
            <p>Password: password123</p>
          </div>
        </motion.div>

        <div className="auth-side">
          <div className="auth-side-content">
            <h2>Continue Your Journey</h2>
            <div className="benefits">
              <div className="benefit">
                <span className="benefit-icon">💪</span>
                <span>Build mental resilience</span>
              </div>
              <div className="benefit">
                <span className="benefit-icon">📈</span>
                <span>Track your progress</span>
              </div>
              <div className="benefit">
                <span className="benefit-icon">🎯</span>
                <span>Achieve your wellness goals</span>
              </div>
              <div className="benefit">
                <span className="benefit-icon">🤝</span>
                <span>Get personalized support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
