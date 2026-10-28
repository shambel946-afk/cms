import React from 'react';

export default function CardRoomPage({ patients = [], setPatients }) {
  return (
    <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: '#0f172a' }}>
        Card Room - Patient Registration & Registry
      </h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
            <th style={{ padding: '12px' }}>NAME</th>
            <th style={{ padding: '12px' }}>AGE</th>
            <th style={{ padding: '12px' }}>GENDER</th>
            <th style={{ padding: '12px' }}>INITIAL SYMPTOMS</th>
            <th style={{ padding: '12px' }}>STATUS</th>
            <th style={{ padding: '12px' }}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ padding: '16px', textAlign: 'center', color: '#64748b' }}>No patients registered yet.</td>
            </tr>
          ) : (
            patients.map((p, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px', fontWeight: '600' }}>{p.name || p.full_name}</td>
                <td style={{ padding: '12px' }}>{p.age}</td>
                <td style={{ padding: '12px' }}>{p.gender}</td>
                <td style={{ padding: '12px' }}>{p.symptoms || p.initial_symptoms || 'N/A'}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                    {p.status || 'Pending Checkup'}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <button style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                    Send to Checkup &rarr;
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}