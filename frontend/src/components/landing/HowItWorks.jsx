import React from 'react';
import { 
  UploadCloud, 
  Cpu, 
  ScanEye, 
  FileCheck2,
  ArrowRight
} from 'lucide-react';
import './HowItWorks.css';

const stepsData = [
  {
    step: "01",
    title: "Upload Document",
    subtitle: "Image / Scan Input",
    description: "Upload a digital image or scan of a supported document (e.g., Aadhaar card or Passport) for analysis.",
    icon: <UploadCloud size={26} />
  },
  {
    step: "02",
    title: "AI Processing",
    subtitle: "Extraction & Preprocessing",
    description: "Automated OCR extracts key text fields, identifies script types, decodes barcodes, and detects portrait regions.",
    icon: <Cpu size={26} />
  },
  {
    step: "03",
    title: "Verify & Analyze",
    subtitle: "Forensics & Matching",
    description: "Algorithms inspect image artifacts for potential manipulation while biometric matching compares the portrait with face input.",
    icon: <ScanEye size={26} />
  },
  {
    step: "04",
    title: "Get Results",
    subtitle: "Summary & Record",
    description: "Review detailed inspection indicators, overall risk assessment, and cryptographic verification logs.",
    icon: <FileCheck2 size={26} />
  }
];

function HowItWorks({ showHeaderBadge = true }) {
  return (
    <section className="lp-section how-it-works-section" id="how-it-works">
      <div className="section-container">
        <div className="section-header">
          {showHeaderBadge && <div className="section-badge">PROCESS PIPELINE</div>}
          <h2 className="section-title">
            How <span>PehchaanAI</span> Works
          </h2>
          <p className="section-subtitle">
            A structured multi-step verification pipeline from document ingestion to comprehensive inspection results.
          </p>
        </div>

        <div className="workflow-steps-container">
          <div className="steps-grid">
            {stepsData.map((item, idx) => (
              <div className="workflow-step-card" key={idx}>
                <div className="step-number-badge">{item.step}</div>
                
                <div className="step-icon-wrapper">
                  {item.icon}
                </div>

                <span className="step-subtitle">{item.subtitle}</span>
                <h3 className="step-title">{item.title}</h3>
                <p className="step-desc">{item.description}</p>

                {idx < stepsData.length - 1 && (
                  <div className="step-connector-arrow">
                    <ArrowRight size={18} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
