import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  ScanLine, 
  FileText, 
  CheckCircle2, 
  Fingerprint, 
  ScanFace, 
  Boxes,
  ArrowRight,
  Sparkles,
  Lock,
  Layers,
  FileCheck
} from 'lucide-react';
import './Hero.css';

import bgMap from '../../assets/world_map.png';
import heroDocs from '../../assets/documents.png';

function Hero() {
  return (
    <section className="lp-hero" id="home">
      {/* Background World Map Graphic */}
      <img 
        src={bgMap} 
        alt="Background World Map" 
        className="hero-bg-map" 
        onError={(e) => { e.target.style.display = 'none'; }} 
      />

      <div className="hero-container">
        {/* Left Content Column */}
        <div className="hero-content">
          <div className="hero-badge">
            <Shield size={14} className="badge-icon" /> 
            <span>AI-ASSISTED DOCUMENT VERIFICATION</span>
          </div>
          
          <h1 className="hero-title">
            Every Document<br />
            Tells a Story.<br />
            <span>We Verify the Truth.</span>
          </h1>
          
          <p className="hero-subtitle">
            PehchaanAI is an intelligent document verification prototype leveraging multi-modal AI, biometric face matching, and forensic analysis to assist in detecting identity tampering and verifying document integrity.
          </p>
          
          <div className="hero-buttons">
            <Link to="/login" className="btn-scan-link">
              <button className="btn-scan">
                <ScanLine size={18} />
                <span>Start Scanning</span>
                <ArrowRight size={16} className="btn-arrow" />
              </button>
            </Link>
            <Link to="/how-it-works" className="btn-demo-link">
              <button className="btn-demo">
                <Sparkles size={18} />
                <span>How It Works</span>
              </button>
            </Link>
          </div>

          {/* Clean Feature Strip - Non-numerical, factual capabilities */}
          <div className="hero-features-strip">
            <div className="feature-pill">
              <Sparkles size={14} className="feature-pill-icon" />
              <span>AI Assisted</span>
            </div>
            <div className="feature-pill">
              <Lock size={14} className="feature-pill-icon" />
              <span>Privacy Focused</span>
            </div>
            <div className="feature-pill">
              <Layers size={14} className="feature-pill-icon" />
              <span>Multi-Layer Verification</span>
            </div>
            <div className="feature-pill">
              <FileCheck size={14} className="feature-pill-icon" />
              <span>Secure Records</span>
            </div>
          </div>
        </div>

        {/* Right Graphics Column - Passport + Aadhaar 3D + 5 Capability Cards */}
        <div className="hero-graphics-wrapper">
          <div className="hero-graphics">
            {/* Visual Documents 3D Showcase */}
            <div className="docs-visual-stage">
              <div className="docs-glow-effect"></div>
              <img 
                src={heroDocs} 
                alt="Indian Passport and Aadhaar Card Analysis" 
                className="hero-documents-img" 
                onError={(e) => { e.target.style.display = 'none'; }} 
              />
            </div>

            {/* 5 Capability Description Cards (No fake percentages or live results) */}
            <div className="status-cards-container">
              <div className="status-card">
                <div className="connecting-line"></div>
                <div className="status-icon">
                  <FileText size={18} />
                </div>
                <div className="status-text">
                  <h4>OCR Extraction</h4>
                  <p>Extract information from identity documents</p>
                </div>
              </div>
              
              <div className="status-card">
                <div className="connecting-line"></div>
                <div className="status-icon">
                  <CheckCircle2 size={18} />
                </div>
                <div className="status-text">
                  <h4>Document Validation</h4>
                  <p>Check document structure and required fields</p>
                </div>
              </div>
              
              <div className="status-card">
                <div className="connecting-line"></div>
                <div className="status-icon">
                  <Fingerprint size={18} />
                </div>
                <div className="status-text">
                  <h4>Tampering Detection</h4>
                  <p>Identify signs of possible document manipulation</p>
                </div>
              </div>
              
              <div className="status-card">
                <div className="connecting-line"></div>
                <div className="status-icon">
                  <ScanFace size={18} />
                </div>
                <div className="status-text">
                  <h4>Face Verification</h4>
                  <p>Compare the document photo with a provided face</p>
                </div>
              </div>
              
              <div className="status-card">
                <div className="connecting-line"></div>
                <div className="status-icon">
                  <Boxes size={18} />
                </div>
                <div className="status-text">
                  <h4>Blockchain Verification</h4>
                  <p>Maintain a secure verification record</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
