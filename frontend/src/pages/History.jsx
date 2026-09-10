import React, { useState, useEffect } from 'react';
import axios from 'axios';

function History() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/screening/history', {
          headers: { 'x-auth-token': token }
        });
        setCases(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch history:', error);
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="card">
      <h2 style={{ marginBottom: '1.5rem' }}>Screening History</h2>
      
      {loading ? (
        <p>Loading history from database...</p>
      ) : cases.length === 0 ? (
        <p>No screening history found. Go do some scans!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ padding: '1rem 0.5rem' }}>Case ID</th>
              <th style={{ padding: '1rem 0.5rem' }}>Name</th>
              <th style={{ padding: '1rem 0.5rem' }}>Passport No</th>
              <th style={{ padding: '1rem 0.5rem' }}>Date</th>
              <th style={{ padding: '1rem 0.5rem' }}>Risk Score</th>
              <th style={{ padding: '1rem 0.5rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold' }}>{c.caseId}</td>
                <td style={{ padding: '1rem 0.5rem' }}>{c.extractedData?.fullName || 'N/A'}</td>
                <td style={{ padding: '1rem 0.5rem' }}>{c.extractedData?.passportNumber || 'N/A'}</td>
                <td style={{ padding: '1rem 0.5rem' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold', color: c.riskScore > 50 ? 'var(--risk-high)' : 'var(--risk-low)' }}>
                  {c.riskScore}
                </td>
                <td style={{ padding: '1rem 0.5rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem',
                    backgroundColor: c.status === 'Flagged' ? '#fee2e2' : '#dcfce3',
                    color: c.status === 'Flagged' ? 'var(--risk-high)' : 'var(--risk-low)'
                  }}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default History;
