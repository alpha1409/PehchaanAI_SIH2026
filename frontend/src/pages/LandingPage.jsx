import React from 'react';
import Hero from '../components/landing/Hero';
import UseCases from '../components/landing/UseCases';
import Modules from '../components/landing/Modules';
import HowItWorks from '../components/landing/HowItWorks';
import AboutUs from '../components/landing/AboutUs';
import ContactUs from '../components/landing/ContactUs';

function LandingPage() {
  return (
    <>
      <Hero />
      <UseCases showHeaderBadge={true} />
      <Modules showHeaderBadge={true} />
      <HowItWorks showHeaderBadge={true} />
      <AboutUs showHeaderBadge={true} />
      <ContactUs showHeaderBadge={true} />
    </>
  );
}

export default LandingPage;
