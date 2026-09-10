import React, { useState } from 'react';
import './LandingPage.css';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';

function LandingPage() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`landing-page ${isDark ? 'dark' : ''}`}>
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <Hero />
    </div>
  );
}

export default LandingPage;
