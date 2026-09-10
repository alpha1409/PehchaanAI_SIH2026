import React from 'react';
import { 
  ShieldCheck, 
  Target, 
  Sparkles, 
  Eye, 
  CheckCircle2,
  FileCheck,
  Layers,
  Cpu,
  Lock
} from 'lucide-react';
import './AboutUs.css';

function AboutUs({ showHeaderBadge = true }) {
  return (
    <section className="lp-section about-us-section" id="about-us">
      <div className="section-container">
        <div className="section-header">
          {showHeaderBadge && <div className="section-badge">ABOUT THE PROJECT</div>}
          <h2 className="section-title">
            About <span>PehchaanAI</span>
          </h2>
          <p className="section-subtitle">
            An AI-assisted document verification and forensic analysis prototype designed for automated identity validation.
          </p>
        </div>

        <div className="about-grid">
          {/* Main narrative block */}
          <div className="about-story-card">
            <div className="about-card-icon">
              <ShieldCheck size={26} />
            </div>
            <h3>What is PehchaanAI?</h3>
            <p>
              PehchaanAI is a prototype identity document screening system built to assist verification officers and automated platforms in validating official credentials. Developed as an innovative project for Smart India Hackathon (SIH 2026), it integrates optical character recognition, digital image forensics, and biometric face matching into a unified inspection pipeline.
            </p>
            <div className="about-highlights">
              <div className="highlight-item">
                <CheckCircle2 size={16} className="highlight-icon" />
                <span>Multi-document format support (Aadhaar cards and Passports)</span>
              </div>
              <div className="highlight-item">
                <CheckCircle2 size={16} className="highlight-icon" />
                <span>Error Level Analysis for detecting digital tampering signs</span>
              </div>
              <div className="highlight-item">
                <CheckCircle2 size={16} className="highlight-icon" />
                <span>Cryptographic state hashing for immutable verification logs</span>
              </div>
            </div>
          </div>

          {/* 3 Pillars in a right column */}
          <div className="about-pillars-stack">
            {/* The Problem */}
            <div className="pillar-card">
              <div className="pillar-header">
                <div className="pillar-icon">
                  <Target size={18} />
                </div>
                <h4>The Problem We Address</h4>
              </div>
              <p>
                Digital editing tools have made document forgery and text alteration increasingly easy to execute. Manual inspections often face fatigue and subtle inconsistencies that automated pixel-level analysis can help highlight.
              </p>
            </div>

            {/* Why Verification Matters */}
            <div className="pillar-card">
              <div className="pillar-header">
                <div className="pillar-icon">
                  <Eye size={18} />
                </div>
                <h4>Why Verification is Vital</h4>
              </div>
              <p>
                Document authenticity forms the foundation of secure onboarding, access control, and identity governance. Automated screening provides a consistent first line of defense before manual escalation.
              </p>
            </div>

            {/* Our Vision */}
            <div className="pillar-card">
              <div className="pillar-header">
                <div className="pillar-icon">
                  <Sparkles size={18} />
                </div>
                <h4>Project Vision</h4>
              </div>
              <p>
                To explore modular, accessible AI techniques for document authenticity verification that can assist developers, researchers, and public systems in identifying suspicious credentials.
              </p>
            </div>
          </div>
        </div>

        {/* Clean Project Highlights Grid (Replacing fake statistics) */}
        <div className="about-highlights-grid">
          <div className="about-highlight-box">
            <div className="highlight-box-icon"><Layers size={20} /></div>
            <h4>Multi-Modal Analysis</h4>
            <p>Combines OCR, image forensics, and facial biometrics</p>
          </div>
          <div className="about-highlight-box">
            <div className="highlight-box-icon"><Cpu size={20} /></div>
            <h4>Automated Pipeline</h4>
            <p>Structured screening workflow designed for fast inference</p>
          </div>
          <div className="about-highlight-box">
            <div className="highlight-box-icon"><Lock size={20} /></div>
            <h4>Privacy Focused</h4>
            <p>Engineered with secure local processing principles</p>
          </div>
          <div className="about-highlight-box">
            <div className="highlight-box-icon"><FileCheck size={20} /></div>
            <h4>Verifiable Logs</h4>
            <p>Cryptographic hash generation for tamper-evident records</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
