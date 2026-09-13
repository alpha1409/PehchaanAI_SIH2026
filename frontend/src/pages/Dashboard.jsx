import React, { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, X, CheckCircle, FileText, Globe, CreditCard, Info, Lightbulb, ScanLine, ArrowRight, Camera, User } from 'lucide-react';

function Dashboard() {
  const [docType, setDocType] = useState('Aadhaar');
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  
  // State to hold the AI results
  const [results, setResults] = useState(null);

  // Face Verification States
  const videoRef = useRef(null);

const DocumentPhotoCard = ({ photo, isAwaiting, isScanning }) => {
  const [lensStyle, setLensStyle] = useState({ display: 'none' });
  const containerRef = useRef(null);
  
  const handleMouseMove = (e) => {
    if (!photo || !photo.available || !containerRef.current) return;
    
    // Check if device supports hover
    if (window.matchMedia('(hover: none)').matches) return;

    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Boundary check
    if (x < 0 || y < 0 || x > width || y > height) {
      setLensStyle({ display: 'none' });
      return;
    }

    const zoom = 2.5;
    const lensSize = 130; // diameter
    const bgX = (x / width) * 100;
    const bgY = (y / height) * 100;

    setLensStyle({
      display: 'block',
      position: 'absolute',
      width: `${lensSize}px`,
      height: `${lensSize}px`,
      left: `${x - lensSize/2}px`,
      top: `${y - lensSize/2}px`,
      borderRadius: '50%',
      backgroundImage: `url(${photo.image})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: `${width * zoom}px ${height * zoom}px`,
      backgroundPosition: `${bgX}% ${bgY}%`,
      border: '2px solid rgba(255, 255, 255, 0.8)',
      boxShadow: '0 8px 16px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(0,0,0,0.1)',
      pointerEvents: 'none', // crucial to not block mouse movements
      zIndex: 10,
      cursor: 'crosshair',
      backgroundColor: '#f8fafc' // fallback
    });
  };

  const handleMouseLeave = () => setLensStyle({ display: 'none' });

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Document Photo</h3>
        {photo && photo.available && (
          <span style={{ backgroundColor: photo.quality === 'good' ? '#dcfce7' : '#fef3c7', color: photo.quality === 'good' ? '#065f46' : '#92400e', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
            {photo.quality === 'good' ? 'DETECTED' : 'LOW QUALITY'}
          </span>
        )}
      </div>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '1.5rem', minHeight: '220px' }}>
        {isScanning ? (
          <div style={{ textAlign: 'center', color: '#64748b' }}>
            <div className="spin" style={{ width: '24px', height: '24px', border: '3px solid #cbd5e1', borderTopColor: '#3b82f6', borderRadius: '50%', margin: '0 auto 12px' }}></div>
            <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>Scanning Photo...</div>
          </div>
        ) : isAwaiting ? (
           <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>Photo will be extracted here...</div>
        ) : (photo && photo.available) ? (
          <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative', width: '100%', maxWidth: '200px', height: '260px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#f1f5f9', cursor: 'crosshair' }}
          >
            <img src={photo.image} alt="Extracted Portrait" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={lensStyle}></div>
            {/* Crosshair target overlay */}
            {lensStyle.display === 'block' && (
              <div style={{
                position: 'absolute',
                left: lensStyle.left,
                top: lensStyle.top,
                width: lensStyle.width,
                height: lensStyle.height,
                pointerEvents: 'none',
                zIndex: 11,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ width: '10px', height: '1px', backgroundColor: 'rgba(255,255,255,0.8)' }}></div>
                <div style={{ width: '1px', height: '10px', backgroundColor: 'rgba(255,255,255,0.8)', position: 'absolute' }}></div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#94a3b8' }}>
            <User size={40} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
            <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#475569' }}>Photo Unavailable</div>
            <div style={{ fontSize: '0.8rem', marginTop: '4px', maxWidth: '80%' }}>{photo?.message || 'Unable to detect a clear photo'}</div>
          </div>
        )}
      </div>
    </div>
  );
};
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [liveImage, setLiveImage] = useState(null);
  const [faceMatchScore, setFaceMatchScore] = useState(null);
  const [isVerifyingFace, setIsVerifyingFace] = useState(false);
  const [anchorStatus, setAnchorStatus] = useState(null);

  const handleAnchorOnBlockchain = async () => {
    if (!results) return;
    try {
      const payload = {
        documentId: results.extractedData?.passportNumber || `DOC-${Date.now()}`,
        documentType: results.documentType,
        verificationStatus: results.riskScore > 50 ? 'Failed' : 'Passed',
        riskScore: results.riskScore,
        caseId: 'SS-2024-05-24-1892'
      };
      const response = await axios.post('http://localhost:5000/api/blockchain/record', payload);
      setAnchorStatus(response.data.record);
    } catch (error) {
      console.error("Blockchain anchor error", error);
      alert("Failed to anchor to blockchain");
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Failed to access webcam");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureFace = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setLiveImage(dataUrl);
      stopCamera();
    }
  };

  const handleVerifyFace = async () => {
    if (!liveImage || !frontFile) {
      alert("Please upload a document and capture your face first.");
      return;
    }
    
    setIsVerifyingFace(true);
    try {
      const formData = new FormData();
      formData.append('documentImage', frontFile);
      
      const res = await fetch(liveImage);
      const blob = await res.blob();
      formData.append('liveImage', blob, 'live.jpg');

      const token = localStorage.getItem('token');
      
      const response = await axios.post('http://localhost:5000/api/screening/verify-face', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token
        }
      });
      
      if (response.data && response.data.matchScore !== undefined) {
         setFaceMatchScore(response.data.matchScore);
      } else {
         alert("Failed to verify face. Check logs.");
      }

    } catch (error) {
      console.error('Face verify error:', error);
      alert("Verification failed: " + (error.response?.data?.error || error.message));
    } finally {
      setIsVerifyingFace(false);
    }
  };

  const handleFrontFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFrontFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setUploadStatus('');
      setResults(null);
    }
  };

  const handleBackFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setBackFile(selectedFile);
      setBackPreview(URL.createObjectURL(selectedFile));
      setUploadStatus('');
    }
  };

  const removeFront = () => {
    setFrontFile(null);
    setPreview(null);
  };

  const removeBack = () => {
    setBackFile(null);
    setBackPreview(null);
  };

  const handleUpload = async () => {
    if (!frontFile) return;

    const formData = new FormData();
    formData.append('documentImage', frontFile);
    if (docType === 'Aadhaar' && backFile) {
      formData.append('documentImage', backFile);
    }

    try {
      setUploadStatus('Processing with AI Pipeline...');
      
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/screening/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token
        }
      });
      
      setUploadStatus('Screening Complete. Auto-anchoring to Blockchain...');
      setResults(response.data); // Save the data to state

      // AUTOMATIC BLOCKCHAIN ANCHOR
      // The officer cannot bypass this step.
      try {
        const payload = {
          documentId: response.data.extractedData?.passportNumber || `DOC-${Date.now()}`,
          documentType: response.data.documentType,
          verificationStatus: response.data.riskScore > 50 ? 'Failed' : 'Passed',
          riskScore: response.data.riskScore,
          caseId: 'SS-2024-05-24-1892'
        };
        const anchorRes = await axios.post('http://localhost:5000/api/blockchain/record', payload);
        setAnchorStatus(anchorRes.data.record);
        setUploadStatus('Screening & Blockchain Anchor Complete.');
      } catch (anchorError) {
        console.error('Error auto-anchoring:', anchorError);
        setUploadStatus('Screening Complete, but Blockchain Anchor failed.');
      }

    } catch (error) {
      console.error('Error uploading:', error);
      if (error.response?.status === 401) {
        setUploadStatus('Unauthorized. Please log in again.');
      } else {
        setUploadStatus('Pipeline failed. Are both Node and Python running?');
      }
    }
  };

  // Helper to determine Risk Color
  const getRiskColor = (score) => {
    if (score < 20) return 'var(--risk-low)';
    if (score < 50) return 'var(--risk-medium)';
    return 'var(--risk-high)';
  };

  const RiskGauge = ({ score, isAwaiting = false }) => {
    const displayScore = isAwaiting ? 0 : score;
    const radius = 80;
    const circumference = Math.PI * radius;
    const dashoffset = circumference - (displayScore / 100) * circumference;

    const angle = Math.PI - (displayScore / 100) * Math.PI;
    const thumbX = 100 + radius * Math.cos(angle);
    const thumbY = 100 - radius * Math.sin(angle);

    let riskText = 'LOW RISK';
    let riskColor = '#10b981';
    if (isAwaiting) {
      riskText = 'AWAITING SCAN';
      riskColor = '#94a3b8';
    } else if (score > 20 && score <= 50) {
      riskText = 'MEDIUM RISK';
      riskColor = '#f59e0b';
    } else if (score > 50) {
      riskText = 'HIGH RISK';
      riskColor = '#ef4444';
    }

    return (
      <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <svg viewBox="0 0 200 120" style={{ width: '100%', maxWidth: '280px', overflow: 'visible' }}>
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke={isAwaiting ? "#e2e8f0" : "url(#gaugeGradient)"} strokeWidth="14" strokeLinecap="round" opacity={isAwaiting ? "1" : "0.2"} />
          {!isAwaiting && (
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gaugeGradient)" strokeWidth="14" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashoffset} style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} />
          )}
          {!isAwaiting && (
            <circle cx={thumbX} cy={thumbY} r="6" fill="white" stroke="#64748b" strokeWidth="2" style={{ transition: 'cx 1.5s ease-out, cy 1.5s ease-out', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
          )}
        </svg>
        <div style={{ position: 'absolute', top: '65px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
            <span style={{ fontSize: '3.5rem', fontWeight: '800', color: isAwaiting ? '#94a3b8' : '#0f172a', lineHeight: '1', letterSpacing: '-2px' }}>{isAwaiting ? '--' : score}</span>
            <span style={{ fontSize: '1.2rem', color: '#94a3b8', fontWeight: '600', marginLeft: '4px' }}>/100</span>
          </div>
          <div style={{ fontSize: '1rem', fontWeight: '800', color: riskColor, marginTop: '5px', letterSpacing: '0.5px' }}>{riskText}</div>
        </div>
      </div>
    );
  };

  const CircularScore = ({ score }) => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';

    return (
      <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="80" height="80">
          <circle cx="40" cy="40" r={radius} stroke="#e2e8f0" strokeWidth="6" fill="none" />
          <circle cx="40" cy="40" r={radius} stroke={color} strokeWidth="6" fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 40 40)" style={{ transition: 'stroke-dashoffset 1s ease-in-out' }} />
        </svg>
        <div style={{ position: 'absolute', fontWeight: 'bold', fontSize: '1.2rem', color: '#0f172a' }}>{score}%</div>
      </div>
    );
  };

  const activeTabStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #3b82f6', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', outline: 'none' };
  const inactiveTabStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', backgroundColor: '#ffffff', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', outline: 'none', transition: 'all 0.2s' };

  return (
    <div className="grid-layout">
      {/* 1. Document Upload */}
      <div className="card" style={{ gridColumn: 'span 2' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.6rem', fontWeight: '800' }}>Document Upload</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '6px' }}>Upload clear images of the document to proceed with verification</p>
          </div>
          <div style={{ backgroundColor: '#eff6ff', padding: '10px 16px', borderRadius: '8px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ backgroundColor: '#3b82f6', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Info size={14} color="white" />
            </div>
            <span style={{ fontSize: '0.8rem', color: '#475569', lineHeight: '1.4' }}>
              <strong style={{ color: '#1e3a8a' }}>Supported Formats</strong><br/>JPG, PNG, PDF (Max 10 MB each)
            </span>
          </div>
        </div>

        <h4 style={{ marginTop: '2rem', marginBottom: '0.8rem', color: '#0f172a', fontSize: '1rem' }}>Document Type</h4>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button onClick={() => setDocType('Aadhaar')} style={docType === 'Aadhaar' ? activeTabStyle : inactiveTabStyle}><CreditCard size={18} /> Aadhaar</button>
          <button onClick={() => setDocType('Passport')} style={docType === 'Passport' ? activeTabStyle : inactiveTabStyle}><Globe size={18} /> Passport</button>
          <button onClick={() => setDocType('Visa')} style={docType === 'Visa' ? activeTabStyle : inactiveTabStyle}><FileText size={18} /> Visa</button>
        </div>

        {docType === 'Aadhaar' && (
          <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#059669', padding: '12px 16px', borderRadius: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', fontWeight: '500' }}>
            <div style={{ backgroundColor: '#10b981', color: 'white', borderRadius: '50%', display: 'flex', padding: '2px' }}><CheckCircle size={14} /></div>
            Upload both front and back sides for Aadhaar verification.
          </div>
        )}

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {/* Front Side */}
          <div style={{ flex: 1, backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 1rem 0', color: '#0f172a' }}>
              <FileText size={18} color="#475569" /> Front Side <span style={{ color: '#64748b', fontWeight: 'normal', fontSize: '0.8rem' }}>(Required)</span>
            </h4>
            {!preview ? (
              <label style={{ display: 'block', border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '2.5rem 1rem', textAlign: 'center', cursor: 'pointer', backgroundColor: '#ffffff', transition: 'border-color 0.2s' }}>
                <UploadCloud size={36} color="#64748b" style={{ marginBottom: '12px' }} />
                <div style={{ color: '#475569', fontSize: '0.95rem' }}>Drag & drop image here<br/>or <span style={{ color: '#2563eb', fontWeight: 'bold' }}>click to browse</span></div>
                <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '10px' }}>JPG, PNG, PDF (Max 10 MB)</div>
                <input type="file" hidden accept="image/jpeg, image/png" onChange={handleFrontFileChange} />
              </label>
            ) : (
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', backgroundColor: '#ffffff', position: 'relative' }}>
                <img src={preview} alt="Front" style={{ width: '100%', height: '160px', objectFit: 'contain', borderRadius: '6px' }} />
                <div style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: '#10b981', color: 'white', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}><CheckCircle size={16} /></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>{frontFile?.name || 'document_front.png'}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>{(frontFile?.size ? (frontFile.size / 1024 / 1024).toFixed(1) : '2.4')} MB</div>
                  </div>
                  <button onClick={removeFront} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}><X size={20} /></button>
                </div>
              </div>
            )}
          </div>

          {/* Back Side (Only for Aadhaar) */}
          {docType === 'Aadhaar' && (
            <div style={{ flex: 1, backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 1rem 0', color: '#0f172a' }}>
                <FileText size={18} color="#475569" /> Back Side <span style={{ color: '#64748b', fontWeight: 'normal', fontSize: '0.8rem' }}>(Required)</span>
              </h4>
              {!backPreview ? (
                <label style={{ display: 'block', border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '2.5rem 1rem', textAlign: 'center', cursor: 'pointer', backgroundColor: '#ffffff', transition: 'border-color 0.2s' }}>
                  <UploadCloud size={36} color="#64748b" style={{ marginBottom: '12px' }} />
                  <div style={{ color: '#475569', fontSize: '0.95rem' }}>Drag & drop image here<br/>or <span style={{ color: '#2563eb', fontWeight: 'bold' }}>click to browse</span></div>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '10px' }}>JPG, PNG, PDF (Max 10 MB)</div>
                  <input type="file" hidden accept="image/jpeg, image/png" onChange={handleBackFileChange} />
                </label>
              ) : (
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', backgroundColor: '#ffffff', position: 'relative' }}>
                  <img src={backPreview} alt="Back" style={{ width: '100%', height: '160px', objectFit: 'contain', borderRadius: '6px' }} />
                  <div style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: '#10b981', color: 'white', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}><CheckCircle size={16} /></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>{backFile?.name || 'document_back.png'}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>{(backFile?.size ? (backFile.size / 1024 / 1024).toFixed(1) : '2.1')} MB</div>
                    </div>
                    <button onClick={removeBack} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}><X size={20} /></button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '16px 20px', borderRadius: '8px', marginTop: '1.5rem', display: 'flex', gap: '16px' }}>
          <Lightbulb color="#2563eb" size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.9rem', color: '#1e3a8a', width: '100%' }}>
            <strong style={{ display: 'block', marginBottom: '8px', fontSize: '0.95rem' }}>Tips for best results:</strong>
            <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', gap: '2rem', listStyleType: 'disc' }}>
              <li>Ensure the document is well-lit and clearly visible</li>
              <li>Avoid blur, glare or cropped edges</li>
              <li>Upload original, unedited images</li>
            </ul>
          </div>
        </div>

        <button 
          onClick={handleUpload}
          disabled={!frontFile || (docType === 'Aadhaar' && !backFile)}
          style={{ 
            width: '100%', padding: '16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', 
            fontSize: '1.1rem', fontWeight: 'bold', marginTop: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px',
            cursor: (!frontFile || (docType === 'Aadhaar' && !backFile)) ? 'not-allowed' : 'pointer',
            opacity: (!frontFile || (docType === 'Aadhaar' && !backFile)) ? 0.6 : 1,
            transition: 'background-color 0.2s'
          }}
        >
          <ScanLine size={22} /> Start AI Screening <ArrowRight size={22} />
        </button>

        {uploadStatus && (
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', textAlign: 'center', color: uploadStatus.includes('fail') ? 'var(--risk-high)' : 'var(--primary-blue)', fontWeight: '600' }}>
            {uploadStatus}
          </p>
        )}
      </div>
      
      {/* 2 & 3. Risk Assessment and Alerts (Stacked in one column) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <h3 style={{ textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px', color: '#475569' }}>Risk Assessment</h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RiskGauge score={results ? results.riskScore : 0} isAwaiting={!results} />
          </div>
        </div>

        <div className="card" style={{ flex: 1 }}>
          <h3>Alerts & Flags</h3>
          {results && results.validation ? (
             <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
               
               <div style={{ padding: '0.8rem 1rem', backgroundColor: results.validation.mrzConsistency?.includes('Failed') ? '#fef2f2' : '#f0fdf4', borderLeft: `4px solid ${results.validation.mrzConsistency?.includes('Failed') ? 'var(--risk-high)' : 'var(--risk-low)'}`, borderRadius: '4px', fontSize: '0.9rem' }}>
                 <strong style={{ display: 'block', marginBottom: '4px' }}>MRZ Cross-Check</strong> 
                 {results.validation.mrzConsistency}
               </div>
               
               <div style={{ padding: '0.8rem 1rem', backgroundColor: results.validation.expirationCheck === 'Failed' ? '#fef2f2' : '#f0fdf4', borderLeft: `4px solid ${results.validation.expirationCheck === 'Failed' ? 'var(--risk-high)' : 'var(--risk-low)'}`, borderRadius: '4px', fontSize: '0.9rem' }}>
                 <strong style={{ display: 'block', marginBottom: '4px' }}>Expiry Status</strong> 
                 {results.validation.expirationCheck}
               </div>

               {results.riskScore > 20 && (
                 <div style={{ padding: '0.8rem 1rem', backgroundColor: '#fffbeb', borderLeft: `4px solid var(--risk-medium)`, borderRadius: '4px', fontSize: '0.9rem' }}>
                   <strong style={{ display: 'block', marginBottom: '4px' }}>Warning</strong> 
                   Review the document manually due to elevated risk score.
                 </div>
               )}
               
             </div>
          ) : (
            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '4px', border: '1px dashed #cbd5e1', color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem' }}>
              No alerts generated yet. Run a scan to see validation flags.
            </div>
          )}
        </div>
      </div>

      {/* 4. Document Photo with Magnifier Lens */}
      <DocumentPhotoCard photo={results?.photo} isAwaiting={!results && !uploadStatus} isScanning={uploadStatus && !results} />
      
      {/* 4. Extracted Information */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Extracted Information</h3>
          {results && results.documentType && (
             <span style={{ backgroundColor: 'var(--primary-blue)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
               {results.documentType}
             </span>
          )}
        </div>
        
        {results ? (
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}><strong style={{ color: 'var(--text-muted)' }}>Name:</strong> <span>{results.extractedData.fullName}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}><strong style={{ color: 'var(--text-muted)' }}>Doc Number:</strong> <span>{results.extractedData.passportNumber}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}><strong style={{ color: 'var(--text-muted)' }}>Nationality:</strong> <span>{results.extractedData.nationality}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}><strong style={{ color: 'var(--text-muted)' }}>DOB:</strong> <span>{results.extractedData.dob}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}><strong style={{ color: 'var(--text-muted)' }}>Gender:</strong> <span>{results.extractedData.gender}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}><strong style={{ color: 'var(--text-muted)' }}>Expiry:</strong> <span>{results.extractedData.expiryDate || 'N/A'}</span></div>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem', fontSize: '0.9rem' }}>OCR data will appear here...</p>
        )}
      </div>

      {/* 5. Document Validation (Original) */}
      <div className="card">
        <h3>Document Validation</h3>
         {results ? (
           <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.95rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
               <strong style={{ color: 'var(--text-muted)' }}>MRZ Consistency:</strong>{' '}
               <span style={{ color: results.validation.mrzConsistency?.includes('Failed') ? 'var(--risk-high)' : 'var(--risk-low)', fontWeight: 'bold' }}>
                 {results.validation.mrzConsistency}
               </span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
               <strong style={{ color: 'var(--text-muted)' }}>Expiration Check:</strong>{' '}
               <span style={{ color: results.validation.expirationCheck === 'Failed' ? 'var(--risk-high)' : 'var(--risk-low)', fontWeight: 'bold' }}>
                 {results.validation.expirationCheck}
               </span>
             </div>
           </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem', fontSize: '0.9rem' }}>Validation checks here...</p>
        )}
      </div>
      
      {/* 6. Tampering Evidence */}
      <div className="card">
        <h3>Tampering Detection</h3>
        {results && results.tampering_data ? (
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#0f172a' }}>Tampering Score:</span>
              <span style={{ fontSize: '1.8rem', fontWeight: '800', color: getRiskColor(results.tampering_data.tamperingScore) }}>
                {results.tampering_data.tamperingScore}<span style={{ fontSize: '1rem', color: '#64748b' }}>/100</span>
              </span>
            </div>
            
            <h4 style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Forensic Analysis</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.95rem' }}>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: results.tampering_data.textRegion === 'Failed' ? '#ef4444' : '#10b981' }}>
                <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>{results.tampering_data.textRegion === 'Failed' ? '⚠' : '✓'}</span>
                <span style={{ color: '#0f172a', fontWeight: results.tampering_data.textRegion === 'Failed' ? '600' : 'normal' }}>
                  {results.tampering_data.textRegion === 'Failed' ? 'Text-region anomaly detected' : 'Text region normal'}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: results.tampering_data.portraitRegion === 'Failed' ? '#ef4444' : '#10b981' }}>
                <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>{results.tampering_data.portraitRegion === 'Failed' ? '⚠' : '✓'}</span>
                <span style={{ color: '#0f172a', fontWeight: results.tampering_data.portraitRegion === 'Failed' ? '600' : 'normal' }}>
                  {results.tampering_data.portraitRegion === 'Failed' ? 'Portrait-region inconsistency' : 'Portrait region normal'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: results.tampering_data.metadata === 'Failed' ? '#ef4444' : '#10b981' }}>
                <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>{results.tampering_data.metadata === 'Failed' ? '⚠' : '✓'}</span>
                <span style={{ color: '#0f172a', fontWeight: results.tampering_data.metadata === 'Failed' ? '600' : 'normal' }}>
                  {results.tampering_data.metadata === 'Failed' ? `Metadata anomaly: ${results.tampering_data.metadataDetails}` : 'Metadata normal'}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: results.tampering_data.stampRegion === 'Failed' ? '#ef4444' : '#10b981' }}>
                <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>{results.tampering_data.stampRegion === 'Failed' ? '⚠' : '✓'}</span>
                <span style={{ color: '#0f172a', fontWeight: results.tampering_data.stampRegion === 'Failed' ? '600' : 'normal' }}>
                  {results.tampering_data.stampRegion === 'Failed' ? 'Stamp region anomaly' : 'Stamp region normal'}
                </span>
              </div>
              
            </div>
          </div>
        ) : (
          <div style={{ marginTop: '1.5rem', height: '200px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Forensics will be displayed here.</p>
          </div>
        )}
      </div>

      {/* 7. Face Verification */}
      <div className="card" style={{ gridColumn: 'span 2' }}>
        <h3 style={{ textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px', color: '#475569', marginBottom: '1.5rem' }}>Face Verification</h3>
        
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'stretch' }}>
          
          {/* Webcam Section */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', height: '240px', backgroundColor: '#f1f5f9', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {!liveImage && !stream && (
                <div style={{ textAlign: 'center', color: '#64748b' }}>
                  <Camera size={32} style={{ marginBottom: '10px' }} />
                  <p style={{ fontSize: '0.9rem' }}>Camera Off</p>
                </div>
              )}
              
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: stream && !liveImage ? 'block' : 'none' }} 
              />
              
              {liveImage && (
                <img src={liveImage} alt="Captured Face" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}

              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', width: '100%' }}>
              {!stream && !liveImage && (
                <button onClick={startCamera} style={{ flex: 1, padding: '10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Start Camera</button>
              )}
              {stream && !liveImage && (
                <button onClick={captureFace} style={{ flex: 1, padding: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Capture Face</button>
              )}
              {liveImage && (
                <button onClick={() => { setLiveImage(null); startCamera(); setFaceMatchScore(null); }} style={{ flex: 1, padding: '10px', backgroundColor: '#64748b', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Retake</button>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div style={{ flex: 1, backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {faceMatchScore === null ? (
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.95rem' }}>Capture a live photo to compare with the document ID.</p>
                <button 
                  onClick={handleVerifyFace}
                  disabled={!liveImage || !frontFile || isVerifyingFace}
                  style={{ 
                    padding: '12px 24px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', 
                    fontWeight: 'bold', cursor: (!liveImage || !frontFile || isVerifyingFace) ? 'not-allowed' : 'pointer',
                    opacity: (!liveImage || !frontFile || isVerifyingFace) ? 0.6 : 1, width: '100%'
                  }}
                >
                  {isVerifyingFace ? 'Verifying...' : 'Verify Biometrics'}
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CircularScore score={faceMatchScore} />
                <h4 style={{ marginTop: '1.2rem', marginBottom: '0.5rem', color: faceMatchScore >= 80 ? '#10b981' : '#ef4444' }}>
                  {faceMatchScore >= 80 ? 'BIOMETRIC MATCH' : 'MATCH FAILED'}
                </h4>
                <p style={{ color: '#475569', fontSize: '0.9rem' }}>
                  The live face {faceMatchScore >= 80 ? 'matches' : 'does not match'} the portrait on the document.
                </p>
                <button 
                  onClick={() => setFaceMatchScore(null)} 
                  style={{ marginTop: '1rem', padding: '8px 16px', background: 'none', border: '1px solid #cbd5e1', color: '#475569', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Clear Results
                </button>
              </div>
            )}
          </div>
          
        </div>
      </div>
      {/* 8. Blockchain Verification Anchor */}
      {results && (
        <div className="card" style={{ gridColumn: 'span 2', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px', color: '#475569', margin: 0 }}>Blockchain Anchor</h3>
            {anchorStatus && (
              <span style={{ backgroundColor: '#10b981', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                Anchored
              </span>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '1rem' }}>
                Securely anchor this verification result to the blockchain to create an immutable audit trail.
              </p>
              
              {anchorStatus ? (
                <div style={{ backgroundColor: '#dcfce7', border: '1px solid #a7f3d0', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.85rem', color: '#065f46', fontWeight: '600', marginBottom: '4px' }}>SHA-256 Hash Generated (Auto-Anchored):</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#047857', wordBreak: 'break-all' }}>
                    {anchorStatus.recordHash}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#065f46', marginTop: '8px' }}>
                    Status: <strong>{anchorStatus.blockchainStatus}</strong>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '12px', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="spin" style={{ width: '16px', height: '16px', border: '2px solid #cbd5e1', borderTopColor: '#3b82f6', borderRadius: '50%' }}></div>
                  Automatically anchoring to Blockchain...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
