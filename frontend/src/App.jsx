import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Bell, User, ChevronDown, LogOut, Home, FileClock, ShieldCheck, ChevronRight } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import BlockchainVerify from './pages/BlockchainVerify';
import Login from './pages/Login';
import LandingLayout from './pages/LandingLayout';
import LandingPage from './pages/LandingPage';
import UseCasesPage from './pages/UseCasesPage';
import ModulesPage from './pages/ModulesPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import logoIcon from './assets/logo.png';

// Sidebar component for Dashboard view
function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar" style={{ 
      position: 'relative', 
      overflow: 'hidden', 
      background: 'linear-gradient(180deg, #f8fcfa 0%, #e1f7f0 100%)',
      borderRight: '1px solid #e2e8f0'
    }}>
      
      {/* Decorative Wave SVG inside the sidebar */}
      <svg viewBox="0 0 200 400" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%', zIndex: 0, opacity: 0.5 }}>
        <path d="M0,200 C50,150 150,250 200,100 L200,400 L0,400 Z" fill="#88f6c6" />
      </svg>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: 'none', padding: '2rem 1.5rem 1.5rem' }}>
          <img src={logoIcon} alt="PehchaanAI Logo" style={{ width: '38px', filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.2))' }} />
          <div>
            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>Pehchaan<span style={{ color: '#10b981' }}>AI</span></h2>
            <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>AI Document Screening</div>
          </div>
        </div>
        
        <nav className="sidebar-nav" style={{ padding: '0 1rem', marginTop: '1rem' }}>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <li className={location.pathname === '/' ? 'active-link' : 'inactive-link'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Home size={20} />
                  <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>New Screening</span>
                </div>
                {location.pathname === '/' && <ChevronRight size={18} />}
              </li>
            </Link>
            <Link to="/history" style={{ textDecoration: 'none' }}>
              <li className={location.pathname === '/history' ? 'active-link' : 'inactive-link'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FileClock size={20} />
                  <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>Screening History</span>
                </div>
                {location.pathname === '/history' && <ChevronRight size={18} />}
              </li>
            </Link>
            <Link to="/blockchain" style={{ textDecoration: 'none' }}>
              <li className={location.pathname === '/blockchain' ? 'active-link' : 'inactive-link'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <ShieldCheck size={20} />
                  <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>Blockchain Verify</span>
                </div>
                {location.pathname === '/blockchain' && <ChevronRight size={18} />}
              </li>
            </Link>
          </ul>
        </nav>
        
        <div className="sidebar-footer" style={{ marginTop: 'auto', borderTop: 'none', padding: '1.5rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', backgroundColor: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <div style={{ backgroundColor: '#dcfce7', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={24} color="#059669" />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>PehchaanAI v1.0</div>
              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Securing Identities, Enabling Trust</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '4px' }}>
            <div style={{ width: '12px', height: '2px', backgroundColor: '#10b981' }}></div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700', letterSpacing: '0.5px' }}>A SAFER INDIA INITIATIVE</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('token'));
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  const officer = JSON.parse(localStorage.getItem('officer')) || { name: 'Verification Officer', badgeNumber: 'SG-2047' };

  useEffect(() => {
    // Close dropdown if clicked outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('officer');
    setIsAuthenticated(false);
    setShowDropdown(false);
  };

  return (
    <BrowserRouter>
      {!isAuthenticated ? (
        <Routes>
          <Route element={<LandingLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/use-cases" element={<UseCasesPage />} />
            <Route path="/modules" element={<ModulesPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/about-us" element={<Navigate to="/about" replace />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/contact-us" element={<Navigate to="/contact" replace />} />
          </Route>
          <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        <div className="dashboard-layout">
          <Sidebar />

          {/* Main Content Area */}
          <div className="main-area">
            <header className="topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#c1f9d8', padding: '1rem 2.5rem', borderBottom: '1px solid #e2e8f0', borderRadius: '0 0 12px 12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
              
              {/* Left Side: Title & Case ID */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <h1 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Screening Result</h1>
                <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500', marginTop: '2px' }}>
                  Case ID: SS-2024-05-24-1892
                </span>
              </div>

              {/* Right Side: Actions & Profile */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} ref={dropdownRef}>
                <Bell size={20} color="#11151a" style={{ cursor: 'pointer' }} />
                
                {/* Vertical Divider */}
                <div style={{ width: '1px', height: '32px', backgroundColor: '#e2e8f0' }}></div>
                
                {/* Profile Section */}
                <div style={{ position: 'relative' }}>
                  <div 
                    onClick={() => setShowDropdown(!showDropdown)}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                  >
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={20} color="#ffffff" strokeWidth={2.5} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#0f172a', lineHeight: '1.2' }}>{officer.badgeNumber || 'SG-2047'}</span>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{officer.name || 'Verification Officer'}</span>
                    </div>
                    <ChevronDown size={16} color="#64748b" style={{ marginLeft: '4px' }} />
                  </div>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div style={{ position: 'absolute', top: '120%', right: '0', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '0.5rem', minWidth: '160px', zIndex: 50 }}>
                      <div 
                        onClick={handleLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1rem', color: '#ef4444', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', borderRadius: '6px', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        <LogOut size={16} /> Logout
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </header>

            <main className="page-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/history" element={<History />} />
                <Route path="/blockchain" element={<BlockchainVerify />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
