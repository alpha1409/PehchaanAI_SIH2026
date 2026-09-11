import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles } from 'lucide-react';
import logoIcon from '../../assets/logo.png';
import './Footer.css';

function Footer() {
  return (
    <footer className="lp-footer">
      <div className="footer-container">
        <div className="footer-main">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-logo-link">
              <div className="footer-logo">
                <img 
                  src={logoIcon} 
                  alt="PehchaanAI Logo" 
                  onError={(e) => { e.target.style.display = 'none'; }} 
                />
                <div className="footer-logo-text">
                  <h2>Pehchaan<span>AI</span></h2>
                  <p>AI Document Verification</p>
                </div>
              </div>
            </Link>
            <p className="footer-tagline">
              An AI-powered document verification and identity forensics prototype designed to assist in detecting digital alterations and verifying credential authenticity.
            </p>
            <div className="footer-project-pill">
              <Sparkles size={14} />
              <span>Smart India Hackathon (SIH 2026) Project</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="footer-links-col">
            <h4>Navigation</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/use-cases">Use Cases</Link></li>
              <li><Link to="/modules">Modules</Link></li>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Modules Column */}
          <div className="footer-links-col">
            <h4>System Modules</h4>
            <ul>
              <li><Link to="/modules">OCR &amp; Extraction</Link></li>
              <li><Link to="/modules">Document Validation</Link></li>
              <li><Link to="/modules">Tampering Detection</Link></li>
              <li><Link to="/modules">Face Verification</Link></li>
              <li><Link to="/modules">AI Risk Analysis</Link></li>
              <li><Link to="/modules">Blockchain Logging</Link></li>
            </ul>
          </div>

          {/* Project Details */}
          <div className="footer-links-col">
            <h4>Project Architecture</h4>
            <div className="footer-tech-badges">
              <div className="footer-tech-badge">
                <Shield size={14} />
                <span>Multi-Modal AI Pipeline</span>
              </div>
              <div className="footer-tech-badge">
                <Shield size={14} />
                <span>Error Level Analysis (ELA)</span>
              </div>
              <div className="footer-tech-badge">
                <Shield size={14} />
                <span>Cryptographic State Hashing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} PehchaanAI &bull; Document Verification Prototype. Built for SIH 2026.</p>
          <div className="footer-bottom-links">
            <Link to="/about">About Project</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/login">Officer Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
