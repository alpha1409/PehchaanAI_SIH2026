import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Link as LinkIcon, Database, CheckCircle, AlertTriangle, Hash, Search, ArrowRight, Loader } from 'lucide-react';
import axios from 'axios';

const BlockchainVerify = () => {
  const [status, setStatus] = useState(null);
  const [records, setRecords] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    fetchStatus();
    fetchRecords();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/blockchain/status');
      if (res.data.success) {
        setStatus(res.data);
      }
    } catch (error) {
      console.error("Error fetching status", error);
    }
  };

  const fetchRecords = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/blockchain/records');
      if (res.data.success) {
        setRecords(res.data.records);
      }
    } catch (error) {
      console.error("Error fetching records", error);
    }
  };

  const handleVerify = async () => {
    if (!searchId) return;
    setIsSearching(true);
    setVerifyResult(null);
    try {
      const res = await axios.post('http://localhost:5000/api/blockchain/verify-integrity', { documentId: searchId });
      setVerifyResult(res.data);
    } catch (error) {
      setVerifyResult({
        success: false,
        error: error.response?.data?.error || 'Verification Failed'
      });
    }
    setIsSearching(false);
  };

  return (
    <div className="blockchain-verify-page" style={{ padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <LinkIcon size={28} color="#10b981" />
        <h1 style={{ margin: 0, color: '#0f172a', fontSize: '1.8rem', fontWeight: '800' }}>Blockchain Audit & Verification</h1>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>Network Status</div>
          <div style={{ fontSize: '1.2rem', fontWeight: '700', color: status?.network?.connected ? '#059669' : '#d97706', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {status?.network?.connected ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            {status?.network?.status || 'Loading...'}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>{status?.network?.network || 'N/A'}</div>
        </div>
        
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>Total Records</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a' }}>{status?.metrics?.totalRecords || 0}</div>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>Verified Documents</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10b981' }}>{status?.metrics?.verifiedRecords || 0}</div>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>Latest Block</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={24} />
            {status?.network?.latestBlock || '---'}
          </div>
        </div>
      </div>

      {/* Search & Verify */}
      <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>Instant Hash Integrity Check</h3>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>Enter a Document ID or Case ID to mathematically prove the record has not been altered since screening.</p>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="e.g. DOC-12345" 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }}
            />
          </div>
          <button 
            onClick={handleVerify}
            disabled={isSearching || !searchId}
            style={{ padding: '0 24px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: (isSearching || !searchId) ? 0.7 : 1 }}
          >
            {isSearching ? <Loader size={18} className="spin" /> : <Hash size={18} />}
            Verify Integrity
          </button>
        </div>

        {/* Verification Banner */}
        {verifyResult && (
          <div style={{ 
            marginTop: '10px', 
            padding: '16px', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            background: verifyResult.success && verifyResult.verification.match ? '#dcfce7' : '#fee2e2',
            border: `1px solid ${verifyResult.success && verifyResult.verification.match ? '#34d399' : '#f87171'}`
          }}>
            {verifyResult.success && verifyResult.verification.match ? (
              <ShieldCheck size={28} color="#059669" />
            ) : (
              <ShieldAlert size={28} color="#dc2626" />
            )}
            <div>
              <div style={{ fontWeight: '700', color: verifyResult.success && verifyResult.verification.match ? '#065f46' : '#991b1b', fontSize: '1.1rem' }}>
                {verifyResult.success ? verifyResult.verification.status : verifyResult.error}
              </div>
              {verifyResult.success && (
                <div style={{ fontSize: '0.85rem', color: verifyResult.verification.match ? '#047857' : '#7f1d1d', marginTop: '4px', wordBreak: 'break-all' }}>
                  <strong>Computed Hash:</strong> {verifyResult.verification.recalculated_hash}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Records Table */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Immutable Audit Log</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', color: '#475569' }}>
                <th style={{ padding: '12px 20px', borderBottom: '1px solid #e2e8f0' }}>Document ID</th>
                <th style={{ padding: '12px 20px', borderBottom: '1px solid #e2e8f0' }}>Type</th>
                <th style={{ padding: '12px 20px', borderBottom: '1px solid #e2e8f0' }}>Risk Score</th>
                <th style={{ padding: '12px 20px', borderBottom: '1px solid #e2e8f0' }}>Hash (SHA-256)</th>
                <th style={{ padding: '12px 20px', borderBottom: '1px solid #e2e8f0' }}>Timestamp</th>
                <th style={{ padding: '12px 20px', borderBottom: '1px solid #e2e8f0' }}>Chain Status</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>No records anchored yet.</td>
                </tr>
              ) : (
                records.map(record => (
                  <tr key={record._id} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} onClick={() => setSelectedRecord(record)} className="hover-row">
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#0f172a' }}>{record.documentId}</td>
                    <td style={{ padding: '16px 20px', color: '#64748b' }}>{record.documentType}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        fontSize: '0.8rem', 
                        fontWeight: '700',
                        background: record.riskScore > 50 ? '#fee2e2' : '#dcfce7',
                        color: record.riskScore > 50 ? '#dc2626' : '#059669'
                      }}>
                        {record.riskScore}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', fontFamily: 'monospace', color: '#64748b', fontSize: '0.8rem' }}>
                      {record.recordHash.substring(0, 16)}...
                    </td>
                    <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '0.85rem' }}>
                      {new Date(record.timestamp).toLocaleString()}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        background: record.blockchainStatus === 'Configuration Required' ? '#fef3c7' : '#f1f5f9',
                        color: record.blockchainStatus === 'Configuration Required' ? '#d97706' : '#475569'
                      }}>
                        {record.blockchainStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .hover-row:hover {
          background-color: #f8fafc;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default BlockchainVerify;
