import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBrain, 
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
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';

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
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);

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

  // Navigation items for the student mental health system (reduced for space)
  const navigationItems = [
    { path: '/', label: 'Home', icon: faHome },
    { path: '/chat', label: 'AI Therapy', icon: faComments },
    { path: '/screening', label: 'Screening', icon: faClipboardList },
    { path: '/resources', label: 'Resources', icon: faBookOpen }
  ];

  // Additional items that appear in user dropdown when logged in
  const userMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: faHeartbeat },
    { path: '/peer-support', label: 'Peer Forum', icon: faUsers, requireAuth: true },
    { path: '/appointments', label: 'Counseling', icon: faCalendarAlt, requireAuth: true },
    { path: '/profile', label: 'Profile', icon: faUser }
  ];

  // Admin navigation items
  const adminItems = [
    { path: '/admin', label: 'Analytics', icon: faChartLine, adminOnly: true }
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

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand/Logo Section */}
        <Link to="/" className="navbar-brand">
          <FontAwesomeIcon icon={faBrain} className="brand-icon" />
          <div className="brand-text">
            <span className="brand-name">StudentMind</span>
            <span className="brand-subtitle">Connect</span>
          </div>
        </Link>

        {/* Desktop Navigation Menu */}
        <div className="navbar-menu">
          <div className="navbar-nav">
            {/* Main navigation items */}
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActiveLink(item.path) ? 'active' : ''}`}
              >
                <FontAwesomeIcon icon={item.icon} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Authentication Section */}
          <div className="navbar-auth">
            {user ? (
              <div className="user-dropdown" ref={dropdownRef}>
                <button 
                  className="user-dropdown-toggle"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span>{user.name || 'User'}</span>
                  <FontAwesomeIcon icon={faChevronDown} className={`dropdown-arrow ${showUserDropdown ? 'open' : ''}`} />
                </button>
                
                {showUserDropdown && (
                  <div className="user-dropdown-menu">
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
                    
                    {/* Admin link if user has admin access */}
                    {(user.role === 'admin' || user.role === 'counselor' || user.role === 'iqac') && (
                      <Link
                        to="/admin"
                        className={`dropdown-item admin-item ${isActiveLink('/admin') ? 'active' : ''}`}
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <FontAwesomeIcon icon={faChartLine} />
                        <span>Analytics</span>
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
                  className="btn btn-outline"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
