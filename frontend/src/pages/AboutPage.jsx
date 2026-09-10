import React from 'react';
import AboutUs from '../components/landing/AboutUs';

function AboutPage() {
  return (
    <div className="page-wrapper" style={{ paddingTop: '5rem', minHeight: '80vh' }}>
      <AboutUs showHeaderBadge={true} />
    </div>
  );
}

export default AboutPage;
