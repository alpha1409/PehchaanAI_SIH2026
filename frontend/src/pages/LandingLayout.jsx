import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import './LandingPage.css';

function LandingLayout() {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('pehchaan_theme');
    return savedTheme ? savedTheme === 'dark' : false;
  });

  const toggleTheme = () => {
    setIsDark((prev) => {
      const nextTheme = !prev;
      localStorage.setItem('pehchaan_theme', nextTheme ? 'dark' : 'light');
      return nextTheme;
    });
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, [isDark]);

  return (
    <div className={`landing-page ${isDark ? 'dark' : ''}`}>
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <main className="landing-main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default LandingLayout;
