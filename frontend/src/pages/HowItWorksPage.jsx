import React from 'react';
import HowItWorks from '../components/landing/HowItWorks';

function HowItWorksPage() {
  return (
    <div className="page-wrapper" style={{ paddingTop: '5rem', minHeight: '80vh' }}>
      <HowItWorks showHeaderBadge={true} />
    </div>
  );
}

export default HowItWorksPage;
