import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome,
  faComments,
  faUsers,
  faClipboardList,
  faBookOpen,
  faCalendarAlt,
  faUser,
  faChartLine,
  faSignOutAlt,
  faHeartbeat,
  faChevronDown,
  faMoon,
  faSun,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import LanguageSwitcher from './LanguageSwitcher';

/**
 * Navbar Component - Navigation for StudentMind Connect
 * 
 * This component provides navigation for the Digital Mental Health System
 * with features specific to student mental health support including:
 * - AI-guided First-Aid Support (Chat)
 * - Peer Support Platform
 * - Mental Health Screening Tools
 * - Psychoeducational Resources
 * - Confidential Booking System
 */

function Navbar({ user, onLogout }) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [theme, setTheme] = useState('light');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userHoverTimeout = useRef(null);

  // Initialize theme based on local storage or prefers-color-scheme
  useEffect(() => {
    const storedTheme = localStorage.getItem('wellsetu-theme');
    if (storedTheme) {
      setTheme(storedTheme);
      return;
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  // Persist and apply theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    document.body.classList.add('theme-transition');
    localStorage.setItem('wellsetu-theme', theme);
  }, [theme]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (userHoverTimeout.current) {
        clearTimeout(userHoverTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Navigation items for the student mental health system (reduced for space)
  const navigationItems = [
    { path: '/', label: t('nav.home'), icon: faHome, isHome: true, public: true },
    { path: '/chat', label: t('nav.chat'), icon: faComments },
    { path: '/screening', label: t('nav.screening'), icon: faClipboardList },
    { path: '/resources', label: t('nav.resources'), icon: faBookOpen }
  ];
  const visibleNavigation = navigationItems.filter((item) => item.public || user);

  // Additional items that appear in user dropdown when logged in
  const userMenuItems = [
    { path: '/dashboard', label: t('nav.dashboard'), icon: faHeartbeat },
    { path: '/peer-support', label: t('nav.peerSupport'), icon: faUsers, requireAuth: true },
    { path: '/appointments', label: t('nav.appointments'), icon: faCalendarAlt, requireAuth: true },
    { path: '/profile', label: t('nav.profile'), icon: faUser }
  ];

  // Function to check if current path is active
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  // Function to handle logout
  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      onLogout();
      navigate('/login');
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const themeIcon = theme === 'light' ? faMoon : faSun;
  const themeLabel = theme === 'light' ? t('nav.switchToDark', { defaultValue: 'Switch to dark mode' }) : t('nav.switchToLight', { defaultValue: 'Switch to light mode' });

  const clearUserHoverTimeout = () => {
    if (userHoverTimeout.current) {
      clearTimeout(userHoverTimeout.current);
      userHoverTimeout.current = null;
    }
  };

  const openUserMenu = () => {
    clearUserHoverTimeout();
    setShowUserDropdown(true);
  };

  const closeUserMenu = (event) => {
    const nextTarget = event?.relatedTarget;
    const isNode = typeof Node !== 'undefined' && nextTarget instanceof Node;
    if (isNode && dropdownRef.current?.contains(nextTarget)) {
      return;
    }
    clearUserHoverTimeout();
    userHoverTimeout.current = setTimeout(() => setShowUserDropdown(false), 220);
  };

  const scrollToHero = () => {
    if (typeof document === 'undefined') {
      return;
    }
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHomeClick = (event) => {
    if (location.pathname === '/') {
      event.preventDefault();
      scrollToHero();
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand/Logo Section */}
        <Link 
          to="/"
          className="navbar-brand"
          state={{ scrollToHero: true }}
          onClick={handleHomeClick}
        >
          <img 
            src="/images/nav-logo.svg" 
            alt="WellSetu Logo" 
            className="brand-logo"
          />
        </Link>

        {/* Desktop Navigation Menu */}
        <div className="navbar-menu">
          <div className="navbar-nav">
            {/* Main navigation items */}
            {visibleNavigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                state={item.isHome ? { scrollToHero: true } : undefined}
                className={`nav-link ${isActiveLink(item.path) ? 'active' : ''}`}
                onClick={item.isHome ? handleHomeClick : undefined}
              >
                <FontAwesomeIcon icon={item.icon} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Authentication Section */}
          <div className="navbar-auth">
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={themeLabel}
              title={themeLabel}
            >
              <FontAwesomeIcon icon={themeIcon} className="icon" />
            </button>
            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-panel"
            >
              <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
            </button>
            <LanguageSwitcher />
            {user ? (
              <div 
                className="user-dropdown"
                ref={dropdownRef}
                onMouseEnter={openUserMenu}
                onMouseLeave={closeUserMenu}
              >
                <button 
                  className="user-dropdown-toggle"
                  onClick={() => {
                    clearUserHoverTimeout();
                    setShowUserDropdown((prev) => !prev);
                  }}
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span>{user.name || 'User'}</span>
                  <FontAwesomeIcon icon={faChevronDown} className={`dropdown-arrow ${showUserDropdown ? 'open' : ''}`} />
                </button>
                
                {showUserDropdown && (
                  <div 
                    className="user-dropdown-menu"
                    onMouseEnter={openUserMenu}
                    onMouseLeave={closeUserMenu}
                  >
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`dropdown-item ${isActiveLink(item.path) ? 'active' : ''}`}
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <FontAwesomeIcon icon={item.icon} />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                    
                    {/* Role-based workspaces */}
                    {(user.role === 'admin' || user.role === 'iqac') && (
                      <Link
                        to="/admin"
                        className={`dropdown-item admin-item ${isActiveLink('/admin') ? 'active' : ''}`}
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <FontAwesomeIcon icon={faChartLine} />
                        <span>Analytics</span>
                      </Link>
                    )}
                    {user.role === 'counselor' && (
                      <Link
                        to="/counselor"
                        className={`dropdown-item admin-item ${isActiveLink('/counselor') ? 'active' : ''}`}
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <FontAwesomeIcon icon={faUsers} />
                        <span>Counselor workspace</span>
                      </Link>
                    )}
                    
                    <hr className="dropdown-divider" />
                    
                    <button 
                      className="dropdown-item logout-item"
                      onClick={() => {
                        setShowUserDropdown(false);
                        handleLogout();
                      }}
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link 
                  to="/login" 
                  className="btn btn-primary"
                >
                  {t('nav.login')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <>
          <div className="mobile-menu-backdrop" onClick={closeMobileMenu} />
          <div
            className="mobile-menu-panel"
            id="mobile-nav-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="mobile-menu-header">
              <span>Navigate</span>
              <button type="button" onClick={closeMobileMenu} aria-label="Close menu">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="mobile-menu-section">
              {visibleNavigation.map((item) => (
                <Link
                  key={`mobile-${item.path}`}
                  to={item.path}
                  state={item.isHome ? { scrollToHero: true } : undefined}
                  className={`mobile-link ${isActiveLink(item.path) ? 'active' : ''}`}
                  onClick={item.isHome ? handleHomeClick : closeMobileMenu}
                >
                  <FontAwesomeIcon icon={item.icon} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
            {user && (
              <div className="mobile-menu-section">
                <p className="mobile-section-label">Your tools</p>
                {userMenuItems.map((item) => (
                  <Link
                    key={`mobile-user-${item.path}`}
                    to={item.path}
                    className={`mobile-link ${isActiveLink(item.path) ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    <FontAwesomeIcon icon={item.icon} />
                    <span>{item.label}</span>
                  </Link>
                ))}
                {(user.role === 'admin' || user.role === 'iqac') && (
                  <Link
                    to="/admin"
                    className={`mobile-link ${isActiveLink('/admin') ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    <FontAwesomeIcon icon={faChartLine} />
                    <span>Analytics</span>
                  </Link>
                )}
                {user.role === 'counselor' && (
                  <Link
                    to="/counselor"
                    className={`mobile-link ${isActiveLink('/counselor') ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    <FontAwesomeIcon icon={faUsers} />
                    <span>Counselor workspace</span>
                  </Link>
                )}
              </div>
            )}
            <div className="mobile-menu-footer">
              <div className="mobile-menu-controls">
                <button
                  type="button"
                  className="theme-toggle"
                  onClick={toggleTheme}
                  aria-label={themeLabel}
                  title={themeLabel}
                >
                  <FontAwesomeIcon icon={themeIcon} className="icon" />
                </button>
                <LanguageSwitcher />
              </div>
              {user ? (
                <button className="mobile-logout" onClick={() => { closeMobileMenu(); handleLogout(); }}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>Logout</span>
                </button>
              ) : (
                <Link to="/login" className="btn btn-primary" onClick={closeMobileMenu}>
                  {t('nav.login')}
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;
