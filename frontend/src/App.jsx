import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Bell, User, ChevronDown, LogOut } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';

// Creating a separate Sidebar component so we can use useLocation()
function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>PehchaanAI</h2>
        <div style={{ fontSize: '0.7rem', color: 'var(--sidebar-text)', marginTop: '4px' }}>AI Document Screening</div>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <li className={location.pathname === '/' ? 'active' : ''}>New Screening</li>
          </Link>
          <Link to="/history" style={{ textDecoration: 'none', color: 'inherit' }}>
            <li className={location.pathname === '/history' ? 'active' : ''}>Screening History</li>
          </Link>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        SSB Police Division
      </div>
    </aside>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  const officer = JSON.parse(localStorage.getItem('officer')) || { name: 'Border Officer', badgeNumber: 'SG-2047' };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsAuthenticated(true);
    }
    
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
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <div className="dashboard-layout">
          <Sidebar />

          {/* Main Content Area */}
          <div className="main-area">
            <header className="topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: '1rem 2.5rem', borderBottom: '1px solid #e2e8f0' }}>
              
              {/* Left Side: Title & Case ID */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <h1 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Screening Result</h1>
                <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500', marginTop: '2px' }}>
                  Case ID: SS-2024-05-24-1892
                </span>
              </div>

              {/* Right Side: Actions & Profile */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} ref={dropdownRef}>
                <Bell size={20} color="#64748b" style={{ cursor: 'pointer' }} />
                
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
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{officer.name || 'Border Officer'}</span>
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
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
