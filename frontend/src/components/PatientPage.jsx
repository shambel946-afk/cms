import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function PatientPage({ patients = [], setPatients = () => {}, doctors = [], setDoctors = () => {}, appointments = [], setAppointments = () => {} }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Patient Modal State
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [patientForm, setPatientForm] = useState({
    name: '', age: '', gender: 'Male', condition: '', status: 'Stable'
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [doctorsRes, appointmentsRes] = await Promise.all([
        API.get('/doctors').catch(() => ({ data: [] })),
        API.get('/appointments').catch(() => ({ data: [] }))
      ]);
      
      const docData = Array.isArray(doctorsRes.data) ? doctorsRes.data : (doctorsRes.data?.data || []);
      const apptData = Array.isArray(appointmentsRes.data) ? appointmentsRes.data : (appointmentsRes.data?.data || []);

      if (typeof setDoctors === 'function') setDoctors(docData);
      if (typeof setAppointments === 'function') setAppointments(apptData);
      if (typeof setPatients === 'function') setPatients([]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchPatientsBySearch = async (query = '') => {
    if (!query.trim()) {
      setPatients([]);
      return;
    }

    try {
      const endpoint = `/patients?search=${encodeURIComponent(query)}`;
      const response = await API.get(endpoint);
      const patData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setPatients(patData);
    } catch (error) {
      console.error('Error searching patients:', error);
      setPatients([]);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPatientsBySearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleOpenRegister = () => {
    setEditingPatientId(null);
    setPatientForm({ name: '', age: '', gender: 'Male', condition: '', status: 'Stable' });
    setIsPatientModalOpen(true);
  };

  const handleOpenEditPatient = (patient) => {
    setEditingPatientId(patient.id);
    setPatientForm({
      name: patient.name || '',
      age: patient.age || '',
      gender: patient.gender || 'Male',
      condition: patient.condition || '',
      status: patient.status || 'Stable'
    });
    setIsPatientModalOpen(true);
  };

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    if (!patientForm.name || !patientForm.age || !patientForm.condition) return;

    try {
      if (editingPatientId !== null) {
        const response = await API.put(`/patients/${editingPatientId}`, patientForm);
        const updatedPatient = response.data?.data || response.data;
        setPatients(patients.map(p => (p.id === editingPatientId ? updatedPatient : p)));
        alert('Patient record updated successfully!');
      } else {
        const response = await API.post('/patients', patientForm);
        const savedPatient = response.data?.data || response.data;
        setPatients([savedPatient, ...patients]);
        alert('Patient registered successfully!');
      }
      setIsPatientModalOpen(false);
      setPatientForm({ name: '', age: '', gender: 'Male', condition: '', status: 'Stable' });
      if (searchQuery) {
        fetchPatientsBySearch(searchQuery);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || JSON.stringify(error.response?.data) || error.message;
      alert(`Failed to save patient: ${errorMsg}`);
    }
  };

  const handleDeletePatient = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await API.delete(`/patients/${id}`);
        setPatients(patients.filter(p => p.id !== id));
      } catch (error) {
        const errorMsg = error.response?.data?.message || JSON.stringify(error.response?.data) || error.message;
        alert(`Failed to delete patient: ${errorMsg}`);
      }
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', textAlign: 'left', boxSizing: 'border-box' }}>
      
      {/* Top Header Section with Flex-Wrap */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px', backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div>
          <h2 style={{ margin: '0 0 6px 0', color: '#0f172a', fontSize: '24px' }}>Patient Portal</h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Search hospital patient records by name from database.</p>
        </div>
        <button 
          onClick={handleOpenRegister}
          style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}
        >
          + Register as Patient & Book Doctor
        </button>
      </div>

      {/* Search Bar & Results Section Card */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <h3 style={{ margin: 0, color: '#0f172a', fontSize: '18px', fontWeight: '700' }}>Search Results</h3>
          <div style={{ width: '320px', maxWidth: '100%' }}>
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Search patient by name..." 
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#ffffff', color: '#0f172a', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Patients Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '14px 20px', color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Patient Name</th>
                <th style={{ padding: '14px 20px', color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Age</th>
                <th style={{ padding: '14px 20px', color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Gender</th>
                <th style={{ padding: '14px 20px', color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Condition</th>
                <th style={{ padding: '14px 20px', color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Assigned Doctor</th>
                <th style={{ padding: '14px 20px', color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '14px 20px', color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? patients.map(p => {
                const appt = appointments.find(a => Number(a.patient_id) === Number(p.id) || (a.patientName || a.patient?.name)?.toLowerCase() === p.name.toLowerCase());
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#0f172a' }}>{p.name}</td>
                    <td style={{ padding: '16px 20px', color: '#0f172a' }}>{p.age}</td>
                    <td style={{ padding: '16px 20px', color: '#0f172a' }}>{p.gender}</td>
                    <td style={{ padding: '16px 20px', color: '#0f172a' }}>{p.condition}</td>
                    <td style={{ padding: '16px 20px', color: '#0f172a' }}>
                      {appt ? `${appt.doctor} (${appt.date})` : 'Not Assigned Yet'}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700', background: '#dcfce7', color: '#166534' }}>
                        {p.status || 'Stable'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <button 
                        onClick={() => handleOpenEditPatient(p)} 
                        style={{ background: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '6px', fontSize: '12px', fontWeight: '600' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeletePatient(p.id)} 
                        style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="7" style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                    {searchQuery ? 'No matching patients found.' : 'Please type a patient name in the search box to view records.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Registration / Edit Modal */}
      {isPatientModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '32px', borderRadius: '16px', width: '420px', maxWidth: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', textAlign: 'left' }}>
            <h3 style={{ marginTop: 0, color: '#0f172a', fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>
              {editingPatientId !== null ? 'Edit Patient Record' : 'Register New Patient'}
            </h3>
            <form onSubmit={handlePatientSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '6px' }}>Full Name:</label>
                <input type="text" value={patientForm.name} onChange={(e) => setPatientForm({...patientForm, name: e.target.value})} required style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#ffffff', color: '#0f172a', boxSizing: 'border-box', outline: 'none' }} placeholder=" " />
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '120px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '6px' }}>Age:</label>
                  <input type="number" value={patientForm.age} onChange={(e) => setPatientForm({...patientForm, age: e.target.value})} required style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#ffffff', color: '#0f172a', boxSizing: 'border-box', outline: 'none' }} />
                </div>
                <div style={{ flex: 1, minWidth: '120px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '6px' }}>Gender:</label>
                  <select value={patientForm.gender} onChange={(e) => setPatientForm({...patientForm, gender: e.target.value})} style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#ffffff', color: '#0f172a', boxSizing: 'border-box', outline: 'none' }}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '6px' }}> Symptoms</label>
                <input type="text" value={patientForm.condition} onChange={(e) => setPatientForm({...patientForm, condition: e.target.value})} required style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#ffffff', color: '#0f172a', boxSizing: 'border-box', outline: 'none' }} placeholder=" " />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '6px' }}>Status</label>
                <select value={patientForm.status} onChange={(e) => setPatientForm({...patientForm, status: e.target.value})} style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#ffffff', color: '#0f172a', boxSizing: 'border-box', outline: 'none' }}>
                  <option value="Stable">Stable</option>
                  <option value="Under Observation">Under Observation</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsPatientModalOpen(false)} style={{ padding: '10px 18px', border: '1px solid #e2e8f0', background: '#ffffff', borderRadius: '8px', cursor: 'pointer', color: '#0f172a', fontWeight: '600' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                  {editingPatientId !== null ? 'Update Patient' : 'Register Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}