import React from 'react';
import { 
  Building2, 
  Landmark, 
  GraduationCap, 
  ShieldAlert, 
  Plane, 
  Building,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './UseCases.css';

const useCasesData = [
  {
    id: 1,
    icon: <Building2 size={24} />,
    title: "Government & Citizen Services",
    tag: "Public Services",
    description: "Can support automated checking of citizen identity cards for public welfare schemes and digital services, helping reduce manual review overhead."
  },
  {
    id: 2,
    icon: <Landmark size={24} />,
    title: "Banking & Financial Services",
    tag: "FinTech & KYC",
    description: "Can help verify submitted identity documents during customer onboarding and digital KYC checks to flag potential inconsistencies and anomalies."
  },
  {
    id: 3,
    icon: <GraduationCap size={24} />,
    title: "Education & Employment",
    tag: "Credential Check",
    description: "Potential use in validating identity cards and submitted certificates during student admissions or employee background verification workflows."
  },
  {
    id: 4,
    icon: <ShieldAlert size={24} />,
    title: "Law Enforcement",
    tag: "Field Support",
    description: "Designed to aid field officers in inspecting identity documents for signs of digital manipulation, altered fields, or suspicious discrepancies."
  },
  {
    id: 5,
    icon: <Plane size={24} />,
    title: "Border & Immigration",
    tag: "Border Checkpoints",
    description: "Can assist immigration checkpoints by inspecting passport layout elements, MRZ lines, and comparing document photos with live camera input."
  },
  {
    id: 6,
    icon: <Building size={24} />,
    title: "Enterprise Verification",
    tag: "Access & Compliance",
    description: "Can be integrated into visitor management systems and vendor onboarding workflows to confirm valid identity credentials."
  }
];

function UseCases({ showHeaderBadge = true }) {
  return (
    <section className="lp-section use-cases-section" id="use-cases">
      <div className="section-container">
        <div className="section-header">
          {showHeaderBadge && <div className="section-badge">POTENTIAL APPLICATIONS</div>}
          <h2 className="section-title">
            Use Cases &amp; <span>Applications</span>
          </h2>
          <p className="section-subtitle">
            Exploring potential real-world scenarios where multi-layer document analysis and AI forensics can assist verification workflows.
          </p>
        </div>

        <div className="use-cases-grid">
          {useCasesData.map((item) => (
            <div className="use-case-card" key={item.id}>
              <div className="card-top">
                <div className="use-case-icon">
                  {item.icon}
                </div>
                <span className="use-case-tag">{item.tag}</span>
              </div>
              
              <h3 className="use-case-title">{item.title}</h3>
              <p className="use-case-desc">{item.description}</p>
              
              <div className="use-case-footer">
                <Link to="/modules" className="learn-more">
                  Explore Capabilities <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default UseCases;
