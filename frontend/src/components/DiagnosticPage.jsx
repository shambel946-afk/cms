import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DiagnosticPage({ title, testType, patients = [], doctors = [] }) {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ patient_name: '', doctor_name: '', clinical_notes: '' });
  const [resultInput, setResultInput] = useState({});

  useEffect(() => {
    fetchRequests();
  }, [testType]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/diagnostics?type=${encodeURIComponent(testType)}`);
      setRequests(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOrderTest = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/diagnostics', {
        ...form,
        test_type: testType,
        status: 'Pending'
      });
      setForm({ patient_name: '', doctor_name: '', clinical_notes: '' });
      fetchRequests();
      alert(`Order successfully sent to ${title}!`);
    } catch (err) {
      alert('Failed to send diagnostic order.');
    }
  };

  const handleCompleteTest = async (id) => {
    const findings = resultInput[id] || '';
    if (!findings.trim()) {
      alert('Please enter test results/findings before submitting back to the doctor.');
      return;
    }

    try {
      await axios.put(`http://127.0.0.1:8000/api/diagnostics/${id}`, {
        status: 'Completed',
        results: findings
      });
      fetchRequests();
      alert('Results sent back to the doctor successfully!');
    } catch (err) {
      alert('Failed to update test results.');
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ color: '#0f172a', marginBottom: '20px' }}>{title}</h2>

      {/* Doctor Order Form Section */}
      <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>Doctor Order Form: Request {testType}</h4>
        <form onSubmit={handleOrderTest} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <input 
            type="text" 
            placeholder="Patient Name" 
            value={form.patient_name} 
            onChange={e => setForm({...form, patient_name: e.target.value})} 
            required 
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
          />
          <input 
            type="text" 
            placeholder="Ordering Doctor Name" 
            value={form.doctor_name} 
            onChange={e => setForm({...form, doctor_name: e.target.value})} 
            required 
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
          />
          <input 
            type="text" 
            placeholder="Clinical Notes / Reason for Test" 
            value={form.clinical_notes} 
            onChange={e => setForm({...form, clinical_notes: e.target.value})} 
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
          />
          <button type="submit" style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
            Send Order to Room
          </button>
        </form>
      </div>

      {/* Requests & Results Table */}
      <h3 style={{ fontSize: '16px', color: '#0f172a', marginBottom: '12px' }}>Incoming & Processed Test Requests</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <th style={{ padding: '12px' }}>Patient Name</th>
            <th style={{ padding: '12px' }}>Doctor</th>
            <th style={{ padding: '12px' }}>Notes</th>
            <th style={{ padding: '12px' }}>Status</th>
            <th style={{ padding: '12px' }}>Results / Findings</th>
            <th style={{ padding: '12px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '12px', fontWeight: '600' }}>{req.patient_name}</td>
              <td style={{ padding: '12px' }}>{req.doctor_name}</td>
              <td style={{ padding: '12px' }}>{req.clinical_notes || 'None'}</td>
              <td style={{ padding: '12px' }}>
                <span style={{ 
                  backgroundColor: req.status === 'Completed' ? '#dcfce7' : '#fef3c7', 
                  color: req.status === 'Completed' ? '#166534' : '#92400e', 
                  padding: '4px 10px', 
                  borderRadius: '12px', 
                  fontSize: '12px', 
                  fontWeight: '700' 
                }}>
                  {req.status}
                </span>
              </td>
              <td style={{ padding: '12px' }}>
                {req.status === 'Completed' ? (
                  <span style={{ color: '#059669', fontWeight: '600' }}>{req.results}</span>
                ) : (
                  <input 
                    type="text" 
                    placeholder="Enter results..." 
                    value={resultInput[req.id] || ''} 
                    onChange={e => setResultInput({...resultInput, [req.id]: e.target.value})}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', width: '100%' }}
                  />
                )}
              </td>
              <td style={{ padding: '12px' }}>
                {req.status !== 'Completed' ? (
                  <button 
                    onClick={() => handleCompleteTest(req.id)} 
                    style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', whiteSpace: 'nowrap' }}
                  >
                    Send to Doctor
                  </button>
                ) : (
                  <span style={{ color: '#64748b', fontSize: '13px' }}>Sent ✓</span>
                )}
              </td>
            </tr>
          ))}
          {requests.length === 0 && (
            <tr>
              <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No pending or processed requests found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}