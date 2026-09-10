import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ScanLine, Play, FileText, CheckCircle, Fingerprint, ScanFace, Box } from 'lucide-react';
import './Hero.css';

// Importing the assets the user provided
import bgMap from '../../assets/world_map.png';
import heroDocs from '../../assets/documents.png';

function Hero() {
  return (
    <section className="lp-hero">
      {/* Background Map Graphic */}
      <img src={bgMap} alt="" className="hero-bg-map" onError={(e) => { e.target.style.display = 'none'; }} />

      <div className="hero-content">
        <div className="hero-badge">
          <Shield size={14} /> AI-POWERED • SECURE • TRUSTED
        </div>
        
        <h1 className="hero-title">
          Every Document<br />
          Tells a Story.<br />
          <span>We Verify the Truth.</span>
        </h1>
        
        <p className="hero-subtitle">
          PehchaanAI leverages advanced AI to detect fake identities, verify documents, and secure our nation against threats. Rapid. Accurate. Reliable.
        </p>
        
        <div className="hero-buttons">
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button className="btn-scan">
              <ScanLine size={18} /> Start Scanning
            </button>
          </Link>
          <button className="btn-demo">
            <Play size={18} /> Watch Demo
          </button>
        </div>
      </div>

      <div className="hero-graphics">
        {/* Floating 3D Documents */}
        <img src={heroDocs} alt="Floating Passport and Aadhaar" className="hero-documents-img" onError={(e) => { e.target.style.display = 'none'; }} />

        {/* Floating Status Cards built entirely in HTML/CSS */}
        <div className="status-cards-container">
          <div className="status-card" style={{ transform: 'translateX(-20px)' }}>
            <div className="status-icon"><FileText size={20} /></div>
            <div className="status-text">
              <h4>OCR Extraction</h4>
              <p>98.7% Accuracy</p>
            </div>
          </div>
          
          <div className="status-card" style={{ transform: 'translateX(-10px)' }}>
            <div className="status-icon"><CheckCircle size={20} /></div>
            <div className="status-text">
              <h4>Document Validation</h4>
              <p>Verified</p>
            </div>
          </div>
          
          <div className="status-card">
            <div className="status-icon"><Fingerprint size={20} /></div>
            <div className="status-text">
              <h4>Tampering Detection</h4>
              <p>No Threats</p>
            </div>
          </div>
          
          <div className="status-card" style={{ transform: 'translateX(-10px)' }}>
            <div className="status-icon"><ScanFace size={20} /></div>
            <div className="status-text">
              <h4>Face Verification</h4>
              <p>96% Match</p>
            </div>
          </div>
          
          <div className="status-card" style={{ transform: 'translateX(-20px)' }}>
            <div className="status-icon"><Box size={20} /></div>
            <div className="status-text">
              <h4>Secured with Blockchain</h4>
              <p>Immutable & Trusted</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
