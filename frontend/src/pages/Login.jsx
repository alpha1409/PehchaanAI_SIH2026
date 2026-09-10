import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ShieldCheck, LockKeyhole, FileSearch, ScanFace, ShieldAlert, Users, ArrowRight } from 'lucide-react';
import bgImage from '../assets/backgroundLogin.png';
import logo from '../assets/logo.png';

function Login({ setAuth }) {
  const [badgeNumber, setBadgeNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        badgeNumber,
        password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('officer', JSON.stringify(response.data.officer));
      
      setAuth(true);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      width: '100vw', 
      overflow: 'hidden', 
      backgroundColor: '#0f172a', 
      position: 'relative',
      fontFamily: 'Inter, sans-serif'
    }}>
      
      {/* Background Image with lowered opacity */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        backgroundImage: `url(${bgImage})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        opacity: 0.4, 
        zIndex: 0 
      }}></div>

      {/* Dark Overlay for the entire background */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.2) 100%)', zIndex: 0 }}></div>

      {/* LEFT SIDE - Marketing Area (50%) */}
      <div style={{ 
        flex: 1, 
        position: 'relative', 
        zIndex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        padding: '3rem 4rem'
      }}>
        
        {/* Center Content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '-8rem' }}>
          <img src={logo} alt="PehchaanAI Logo" style={{ width: '130px', marginBottom: '1rem', filter: 'drop-shadow(0 0 15px rgba(16,185,129,0.3))' }} />
          <h1 style={{ fontSize: '3.2rem', margin: 0, color: 'white', fontWeight: '800' }}>
            Pehchaan<span style={{ color: '#16a34a' }}>AI</span>
          </h1>
          <p style={{ color: '#f8fafc', fontSize: '1.2rem', marginTop: '0.5rem', maxWidth: '400px', lineHeight: '1.4', fontWeight: '300' }}>
            AI-Powered Identity Verification<br/>for Safer Borders
          </p>

          {/* 4 Feature Icons Row */}
          <div style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <FileSearch size={28} color="#16a34a" />
              <span style={{ color: 'white', fontSize: '0.8rem', textAlign: 'center' }}>Verify<br/>Documents</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <ScanFace size={28} color="#16a34a" />
              <span style={{ color: 'white', fontSize: '0.8rem', textAlign: 'center' }}>Detect<br/>Fake Identities</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={28} color="#16a34a" />
              <span style={{ color: 'white', fontSize: '0.8rem', textAlign: 'center' }}>Prevent<br/>Fraud</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={28} color="#16a34a" />
              <span style={{ color: 'white', fontSize: '0.8rem', textAlign: 'center' }}>Stronger<br/>Borders</span>
            </div>
          </div>


        </div>

        {/* Bottom Left Footer */}
        <div style={{ position: 'absolute', bottom: '3rem', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '2rem', color: '#cbd5e1', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={16} /> Trusted by Indian Border Security</div>
          <div style={{ width: '1px', height: '16px', backgroundColor: '#475569' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><LockKeyhole size={16} /> Secure • Confidential • Reliable</div>
        </div>
      </div>

      {/* RIGHT SIDE - Login Card (Floating 50%) */}
      <div style={{ 
        flex: 1, 
        position: 'relative', 
        zIndex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '1.5rem'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '460px', 
          backgroundColor: '#ffffff', 
          borderRadius: '16px', 
          padding: '2rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Version */}
          <div style={{ textAlign: 'right', color: '#94a3b8', fontSize: '0.7rem', marginBottom: '0.2rem' }}>v1.0</div>

          <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
            <h2 style={{ fontSize: '1.6rem', color: '#0f172a', margin: '0 0 0.3rem 0', fontWeight: '800' }}>
              Welcome to <span style={{ color: '#16a34a' }}>PehchaanAI</span>
            </h2>
            <p style={{ color: '#64748b', margin: 0, fontSize: '0.85rem' }}>
              Sign in to continue to the secure officer portal
            </p>
          </div>

          {error && (
            <div style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '0.6rem', borderRadius: '8px', marginBottom: '0.8rem', textAlign: 'center', fontSize: '0.8rem', border: '1px solid #fecaca' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Officer ID Input */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', fontWeight: '600', color: '#1e293b' }}>Officer ID</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.8rem', color: '#64748b' }}>
                  <User size={16} />
                </div>
                <input 
                  type="text" 
                  value={badgeNumber}
                  onChange={(e) => setBadgeNumber(e.target.value)}
                  placeholder="Enter your Officer ID"
                  style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.4rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                  onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', fontWeight: '600', color: '#1e293b' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.8rem', color: '#64748b' }}>
                  <Lock size={16} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{ width: '100%', padding: '0.7rem 2.4rem 0.7rem 2.4rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                  onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  required
                />
                <div 
                  style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '0.8rem', color: '#94a3b8', cursor: 'pointer' }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: '#475569' }}>
                <input type="checkbox" style={{ accentColor: '#16a34a', width: '13px', height: '13px', margin: 0 }} />
                Remember me
              </label>
              <span style={{ color: '#16a34a', fontWeight: '500', cursor: 'pointer' }}>Forgot Password?</span>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              style={{ 
                width: '100%', padding: '0.7rem', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', 
                fontSize: '0.9rem', fontWeight: '600', cursor: isLoading ? 'not-allowed' : 'pointer', marginTop: '0.2rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#15803d'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#16a34a'}
            >
              <ShieldCheck size={16} />
              {isLoading ? 'AUTHENTICATING...' : 'Sign In'}
              {!isLoading && <ArrowRight size={16} style={{ marginLeft: '4px' }} />}
            </button>
          </form>

          {/* OR Divider */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '0.8rem 0', color: '#cbd5e1' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#f1f5f9' }}></div>
            <div style={{ padding: '0 0.8rem', fontSize: '0.7rem', color: '#94a3b8' }}>OR</div>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#f1f5f9' }}></div>
          </div>

          {/* SSO Button */}
          <button style={{ 
            width: '100%', padding: '0.7rem', backgroundColor: 'white', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: '8px', 
            fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
          >
            <ShieldAlert size={14} color="#64748b" /> Sign in with Government SSO
          </button>

          {/* Notice Box */}
          <div style={{ backgroundColor: '#f0fdf4', borderRadius: '8px', padding: '0.8rem', display: 'flex', gap: '0.6rem', alignItems: 'flex-start', marginTop: '1rem' }}>
            <ShieldCheck size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h5 style={{ margin: '0 0 0.15rem 0', color: '#16a34a', fontSize: '0.8rem' }}>Authorized Access Only</h5>
              <p style={{ margin: 0, color: '#475569', fontSize: '0.7rem', lineHeight: '1.3' }}>This system is for authorized government personnel only. All activities are monitored and recorded.</p>
            </div>
          </div>

          {/* Right Footer */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.85rem' }}>Pehchaan<span style={{ color: '#16a34a' }}>AI</span></div>
            <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginTop: '3px' }}>People | Technology | Safer Borders</div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Login;
