import React from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Fingerprint, 
  ScanFace, 
  Cpu, 
  Boxes,
  Check
} from 'lucide-react';
import './Modules.css';

const modulesData = [
  {
    id: 1,
    icon: <FileText size={24} />,
    title: "OCR & Data Extraction",
    badge: "Text Extraction",
    description: "Extracts printed text, Devanagari script, MRZ lines, and QR barcodes from supported identity cards like Aadhaar and Passport.",
    features: ["Aadhaar, Passport & ID support", "QR and MRZ extraction", "Field parsing & normalization"]
  },
  {
    id: 2,
    icon: <ShieldCheck size={24} />,
    title: "Document Validation",
    badge: "Format Rules",
    description: "Checks document layout conformity, issuer standard patterns, and mathematical checksum validity such as Verhoeff algorithms.",
    features: ["Checksum formula validation", "Standard layout checking", "Required field checks"]
  },
  {
    id: 3,
    icon: <Fingerprint size={24} />,
    title: "Tampering & Forgery Detection",
    badge: "Image Forensics",
    description: "Applies Error Level Analysis (ELA) and image processing techniques to identify potential photo replacement, text splicing, and compression anomalies.",
    features: ["Error Level Analysis (ELA)", "Font and pixel consistency check", "Boundary alteration detection"]
  },
  {
    id: 4,
    icon: <ScanFace size={24} />,
    title: "Face Verification",
    badge: "Biometric Matching",
    description: "Compares the photograph extracted from the identity document against a live webcam capture to estimate facial similarity.",
    features: ["1:1 Facial feature comparison", "Webcam image capture", "Similarity scoring analysis"]
  },
  {
    id: 5,
    icon: <Cpu size={24} />,
    title: "AI Risk Analysis",
    badge: "Composite Assessment",
    description: "Synthesizes observations from OCR extraction, format validation, and tampering indicators to generate a comprehensive risk summary.",
    features: ["Low / Medium / High indicators", "Observation breakdown", "Rule-based flags"]
  },
  {
    id: 6,
    icon: <Boxes size={24} />,
    title: "Blockchain Verification",
    badge: "Cryptographic Log",
    description: "Generates cryptographic hashes of verification events to maintain a tamper-evident, verifiable screening audit log.",
    features: ["Cryptographic SHA-256 hashes", "Tamper-evident logs", "Verification audit history"]
  }
];

function Modules({ showHeaderBadge = true }) {
  return (
    <section className="lp-section modules-section" id="modules">
      <div className="section-container">
        <div className="section-header">
          {showHeaderBadge && <div className="section-badge">SYSTEM ARCHITECTURE</div>}
          <h2 className="section-title">
            Core Verification <span>Modules</span>
          </h2>
          <p className="section-subtitle">
            PehchaanAI combines multiple analysis stages to provide comprehensive inspection of identity documents.
          </p>
        </div>

        <div className="modules-grid">
          {modulesData.map((item) => (
            <div className="module-card" key={item.id}>
              <div className="module-top">
                <div className="module-icon">
                  {item.icon}
                </div>
                <span className="module-badge-tag">{item.badge}</span>
              </div>

              <h3 className="module-title">{item.title}</h3>
              <p className="module-desc">{item.description}</p>

              <div className="module-features">
                {item.features.map((feat, idx) => (
                  <div className="module-feature-item" key={idx}>
                    <Check size={14} className="feature-check-icon" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Modules;
