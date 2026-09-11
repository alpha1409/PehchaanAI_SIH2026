import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  MessageSquare,
  HelpCircle,
  FileCode,
  Shield
} from 'lucide-react';
import './ContactUs.css';

function ContactUs({ showHeaderBadge = true }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    // Client-side feedback state simulation
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        organization: '',
        message: ''
      });
    }, 600);
  };

  return (
    <section className="lp-section contact-us-section" id="contact-us">
      <div className="section-container">
        <div className="section-header">
          {showHeaderBadge && <div className="section-badge">GET IN TOUCH</div>}
          <h2 className="section-title">
            Contact <span>Us</span>
          </h2>
          <p className="section-subtitle">
            Have a question or want to know more about PehchaanAI?
          </p>
        </div>

        <div className="contact-grid">
          {/* Left: Project Inquiry Notes (Neutral & Honest) */}
          <div className="contact-info-panel">
            <div className="info-header">
              <div className="info-icon-badge">
                <MessageSquare size={22} />
              </div>
              <h3>Project Inquiries &amp; Feedback</h3>
              <p>
                PehchaanAI is an ongoing student innovation project developed for Smart India Hackathon (SIH 2026). We welcome questions, technical suggestions, and feature feedback.
              </p>
            </div>

            <div className="contact-project-points">
              <div className="project-point-item">
                <HelpCircle size={18} className="point-icon" />
                <div>
                  <strong>Academic &amp; Research Prototype</strong>
                  <p>Developed as a concept prototype for AI-assisted document verification.</p>
                </div>
              </div>

              <div className="project-point-item">
                <FileCode size={18} className="point-icon" />
                <div>
                  <strong>Technical Architecture</strong>
                  <p>Built with React, Python FastAPI / OpenCV, and cryptographic verification.</p>
                </div>
              </div>

              <div className="project-point-item">
                <Shield size={18} className="point-icon" />
                <div>
                  <strong>Privacy &amp; Security</strong>
                  <p>Designed with data confidentiality principles in mind.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Clean Empty Form with Neutral Placeholders */}
          <div className="contact-form-container">
            {submitted ? (
              <div className="form-success-state">
                <div className="success-icon-wrapper">
                  <CheckCircle2 size={44} />
                </div>
                <h3>Message Sent</h3>
                <p>
                  Thank you for reaching out! Your message has been recorded.
                </p>
                <button 
                  className="btn-submit-another" 
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact-name">Full Name *</label>
                    <input 
                      type="text" 
                      id="contact-name"
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange}
                      placeholder="Enter your name" 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-email">Email Address *</label>
                    <input 
                      type="email" 
                      id="contact-email"
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange}
                      placeholder="Enter your email" 
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-org">Organization / Department</label>
                  <input 
                    type="text" 
                    id="contact-org"
                    name="organization" 
                    value={formData.organization} 
                    onChange={handleChange}
                    placeholder="Enter organization or department (optional)" 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-msg">Message *</label>
                  <textarea 
                    id="contact-msg"
                    name="message" 
                    rows={4}
                    value={formData.message} 
                    onChange={handleChange}
                    placeholder="Enter your message" 
                    required 
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-contact-submit" 
                  disabled={loading}
                >
                  {loading ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactUs;
