import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Lock, Menu, X } from 'lucide-react';
import './Navbar.css';

import logoIcon from '../../assets/logo.png'; 

const NAV_ITEMS = [
  { path: '/', label: 'Home' },
  { path: '/use-cases', label: 'Use Cases' },
  { path: '/modules', label: 'Modules' },
  { path: '/how-it-works', label: 'How It Works' },
  { path: '/about', label: 'About Us' },
  { path: '/contact', label: 'Contact Us' }
];

function Navbar({ isDark, toggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isItemActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`lp-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="lp-navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="lp-logo-link" onClick={handleLinkClick}>
          <div className="lp-logo">
            <img 
              src={logoIcon} 
              alt="PehchaanAI Logo" 
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
            <div className="lp-logo-text">
              <h2>Pehchaan<span>AI</span></h2>
              <p>AI Document Verification</p>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="lp-nav-links">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={isItemActive(item.path) ? 'active' : ''}
                onClick={handleLinkClick}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="lp-nav-actions">
          <button 
            className="theme-toggle" 
            onClick={toggleTheme} 
            aria-label="Toggle Theme"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button className="btn-login">
              <Lock size={16} /> 
              <span>Login</span>
            </button>
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <ul className="mobile-nav-links">
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  className={isItemActive(item.path) ? 'active' : ''}
                  onClick={handleLinkClick}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
