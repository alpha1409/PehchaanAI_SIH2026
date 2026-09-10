import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Lock } from 'lucide-react';
import './Navbar.css';

// Ensure the logo path is correct relative to the assets folder
import logoIcon from '../../assets/logo.png'; 

function Navbar({ isDark, toggleTheme }) {
  return (
    <nav className="lp-navbar">
      <div className="lp-logo">
        <img src={logoIcon} alt="PehchaanAI Logo" onError={(e) => { e.target.style.display = 'none'; }} />
        <div className="lp-logo-text">
          <h2>Pehchaan<span>AI</span></h2>
          <p>AI Document Screening</p>
        </div>
      </div>

      <ul className="lp-nav-links">
        <li className="active">Home</li>
        <li>Use Cases</li>
        <li>Modules</li>
        <li>How It Works</li>
        <li>About Us</li>
        <li>Contact Us</li>
      </ul>

      <div className="lp-nav-actions">
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <Link to="/login" style={{ textDecoration: 'none' }}>
          <button className="btn-login">
            <Lock size={16} /> Login
          </button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
