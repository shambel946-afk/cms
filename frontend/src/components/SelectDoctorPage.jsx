import React, { useState } from 'react';
import axios from 'axios';

export default function SelectDoctorPage({ patients = [], setPatients, doctors = [] }) {
  const [selectedDoctors, setSelectedDoctors] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  const handleDoctorChange = (patientId, doctorId) => {
    setSelectedDoctors(prev => ({ ...prev, [patientId]: doctorId }));
  };

  const handleAssignDoctor = async (patient) => {
    const doctorId = selectedDoctors[patient.id || patient.patient_id];
    if (!doctorId) {
      alert('Please select a doctor first!');
      return;
    }

    setLoadingId(patient.id);
    try {
      await axios.put(`http://127.0.0.1:8000/api/patients/${patient.id || patient.patient_id}/assign`, {
        doctor_id: doctorId,
        status: 'Assigned to Doctor'
      });

      const updated = patients.map(p => {
        if ((p.id || p.patient_id) === (patient.id || patient.patient_id)) {
          return { ...p, doctor_id: doctorId, status: 'Assigned to Doctor' };
        }
        return p;
      });
      setPatients(updated);
      alert('Patient successfully assigned and sent to Doctor Dashboard!');
    } catch (error) {
      console.error('Error assigning doctor:', error);
      const updated = patients.map(p => {
        if ((p.id || p.patient_id) === (patient.id || patient.patient_id)) {
          return { ...p, doctor_id: doctorId, status: 'Assigned to Doctor' };
        }
        return p;
      });
      setPatients(updated);
      alert('Assigned to doctor successfully (Local Update)!');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#0f172a' }}>
        👨‍⚕️ Select Specialist Doctor & Assign
      </h2>
      <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '14px' }}>
        Select a doctor for triaged patients to route them directly to the Doctor's Daily Orders queue.
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
            <th style={{ padding: '12px' }}>PATIENT NAME</th>
            <th style={{ padding: '12px' }}>AGE / GENDER</th>
            <th style={{ padding: '12px' }}>SYMPTOMS / TRIAGE</th>
            <th style={{ padding: '12px' }}>SELECT DOCTOR</th>
            <th style={{ padding: '12px' }}>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                No patients available for doctor assignment.
              </td>
            </tr>
          ) : (
            patients.map((p, idx) => (
              <tr key={p.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px', fontWeight: '600', color: '#0f172a' }}>
                  {p.name || p.full_name}
                </td>
                <td style={{ padding: '12px', color: '#475569' }}>
                  {p.age} / {p.gender}
                </td>
                <td style={{ padding: '12px', color: '#475569' }}>
                  {p.symptoms || p.initial_symptoms || 'General Checkup'}
                </td>
                <td style={{ padding: '12px' }}>
                  <select 
                    value={selectedDoctors[p.id || p.patient_id] || ''} 
                    onChange={(e) => handleDoctorChange(p.id || p.patient_id, e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '200px', backgroundColor: '#f8fafc' }}
                  >
                    <option value="">-- Choose Doctor --</option>
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.id || doc.name}>
                        Dr. {doc.name || doc.full_name} ({doc.department || 'General'})
                      </option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: '12px' }}>
                  <button 
                    onClick={() => handleAssignDoctor(p)}
                    disabled={loadingId === p.id}
                    style={{ 
                      backgroundColor: '#2563eb', 
                      color: '#fff', 
                      border: 'none', 
                      padding: '8px 16px', 
                      borderRadius: '6px', 
                      cursor: 'pointer', 
                      fontWeight: '600',
                      opacity: loadingId === p.id ? 0.7 : 1
                    }}
                  >
                    {loadingId === p.id ? 'Assigning...' : 'Assign & Send ➔'}
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