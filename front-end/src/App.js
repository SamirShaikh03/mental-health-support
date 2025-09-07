import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Import CSS styles
import './App.css';
import './styles.css';

// Import all navigation and layout components
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

// Import all page components for the Digital Mental Health System
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Chat from './pages/Chat.jsx';                    // AI-guided First-Aid Support
import Resources from './pages/Resources.jsx';          // Psychoeducational Resource Hub
import PeerSupport from './pages/PeerSupport.jsx';      // Peer Support Platform
import Appointments from './pages/Appointments.jsx';    // Confidential Booking System
import AdminDashboard from './pages/AdminDashboard.jsx'; // Admin Dashboard with Analytics
import Profile from './pages/Profile.jsx';
import ScreeningTest from './pages/ScreeningTest.jsx';  // Mental Health Screening Tools

// Import styling files
import './App.css';
import './styles.css';

function App() {
  // State management for user authentication and loading status
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Effect hook to check for existing user session when app loads
  useEffect(() => {
    // Check for existing user session in localStorage
    const savedUser = localStorage.getItem('studentmind_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Function to handle user login - saves user data to localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('studentmind_user', JSON.stringify(userData));
  };

  // Function to handle user logout - removes user data from localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('studentmind_user');
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">🧠</div>
        <h2>StudentMind Connect</h2>
        <p>Digital Mental Health Support for Students</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        {/* Navigation bar component */}
        <Navbar user={user} onLogout={logout} />
        
        <main className="main-content">
          {/* Route definitions for the Digital Mental Health System */}
          <Routes>
            {/* Public routes - accessible without login */}
            <Route path="/" element={<Home user={user} />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={login} />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register onLogin={login} />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/screening" element={<ScreeningTest user={user} />} />
            
            {/* Protected routes - require user authentication */}
            <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
            <Route path="/chat" element={user ? <Chat user={user} /> : <Navigate to="/login" />} />
            <Route path="/peer-support" element={user ? <PeerSupport user={user} /> : <Navigate to="/login" />} />
            <Route path="/appointments" element={user ? <Appointments user={user} /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
            
            {/* Admin route - for institutional administrators */}
            <Route path="/admin" element={user ? <AdminDashboard user={user} /> : <Navigate to="/login" />} />
          </Routes>
        </main>
        
        {/* Footer component */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
