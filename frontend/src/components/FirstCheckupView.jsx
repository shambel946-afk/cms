import React from 'react';

export default function FirstCheckupPage({ patients = [], setPatients }) {
  const handleSendToDoctorSelect = (patientId) => {
    const updated = patients.map(p => {
      if ((p.id || p.patient_id) === patientId) {
        return { ...p, status: 'Ready for Doctor' };
      }
      return p;
    });
    setPatients(updated);
    alert('Patient sent to Doctor Assignment stage!');
  };

  return (
    <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#0f172a' }}>
        🩺 First Checkup Room (Triage & Vitals)
      </h2>
      <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '14px' }}>
        Record patient vital signs (BP, Temperature, Pulse) and forward them for doctor selection.
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
            <th style={{ padding: '12px' }}>NAME</th>
            <th style={{ padding: '12px' }}>AGE / GENDER</th>
            <th style={{ padding: '12px' }}>SYMPTOMS</th>
            <th style={{ padding: '12px' }}>STATUS</th>
            <th style={{ padding: '12px' }}>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                No patients in triage queue.
              </td>
            </tr>
          ) : (
            patients.map((p, idx) => (
              <tr key={p.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px', fontWeight: '600' }}>{p.name || p.full_name}</td>
                <td style={{ padding: '12px' }}>{p.age} / {p.gender}</td>
                <td style={{ padding: '12px' }}>{p.symptoms || p.initial_symptoms || 'N/A'}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                    {p.status || 'Pending Triage'}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <button 
                    onClick={() => handleSendToDoctorSelect(p.id || p.patient_id)}
                    style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                  >
                    Send to Doctor Select ➔
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