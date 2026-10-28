import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function Dashboard({ patients = [], setPatients = () => {}, doctors = [], setDoctors = () => {}, appointments = [], setAppointments = () => {} }) {
  const [activeSubTab, setActiveSubTab] = useState('card_room'); // 'card_room', 'checkup_room', 'assignment_room', 'doctors'
  const [searchQuery, setSearchQuery] = useState('');

  // Patient Modal State (Card Room)
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [patientForm, setPatientForm] = useState({
    name: '', age: '', gender: 'Male', condition: '', status: 'Pending Checkup'
  });

  // First Checkup Room Modal State (Triage)
  const [isCheckupModalOpen, setIsCheckupModalOpen] = useState(false);
  const [selectedPatientForCheckup, setSelectedPatientForCheckup] = useState(null);
  const [checkupForm, setCheckupForm] = useState({
    vitals: '',
    checkup_notes: '',
    status: 'Checked Up'
  });

  // Assign Doctor Modal State (Specialist Referral)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedPatientForAssign, setSelectedPatientForAssign] = useState(null);
  const [assignForm, setAssignForm] = useState({
    doctor: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    notes: ''
  });

  // Doctor Modal State
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [doctorForm, setDoctorForm] = useState({
    name: '', specialization: '', phone: '', status: 'Active'
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [doctorsRes, appointmentsRes, patientsRes] = await Promise.all([
        API.get('/doctors').catch(() => ({ data: [] })),
        API.get('/appointments').catch(() => ({ data: [] })),
        API.get('/patients').catch(() => ({ data: [] }))
      ]);

      const docData = Array.isArray(doctorsRes.data) ? doctorsRes.data : (doctorsRes.data?.data || []);
      const apptData = Array.isArray(appointmentsRes.data) ? appointmentsRes.data : (appointmentsRes.data?.data || []);
      const patData = Array.isArray(patientsRes.data) ? patientsRes.data : (patientsRes.data?.data || []);

      if (typeof setDoctors === 'function') setDoctors(docData);
      if (typeof setAppointments === 'function') setAppointments(apptData);
      if (typeof setPatients === 'function') setPatients(patData);
    } catch (error) {
      console.error('Error fetching initial dashboard data:', error);
    }
  };

  const fetchPatientsBySearch = async (query = '') => {
    try {
      const endpoint = query.trim() ? `/patients?search=${encodeURIComponent(query)}` : '/patients';
      const response = await API.get(endpoint);
      const patData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setPatients(patData);
    } catch (error) {
      console.error('Error fetching search data:', error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPatientsBySearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 1. Card Room: Register / Edit Patient
  const handleOpenRegister = () => {
    setEditingPatientId(null);
    setPatientForm({ name: '', age: '', gender: 'Male', condition: '', status: 'Pending Checkup' });
    setIsPatientModalOpen(true);
  };

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    if (!patientForm.name || !patientForm.age || !patientForm.condition) return;

    try {
      if (editingPatientId !== null) {
        const response = await API.put(`/patients/${editingPatientId}`, patientForm);
        const updated = response.data?.data || response.data;
        setPatients(patients.map(p => (p.id === editingPatientId ? updated : p)));
        alert('Patient record updated successfully!');
      } else {
        const response = await API.post('/patients', patientForm);
        const saved = response.data?.data || response.data;
        setPatients([saved, ...patients]);
        alert('Patient registered in Card Room successfully!');
      }
      setIsPatientModalOpen(false);
      fetchPatientsBySearch(searchQuery);
    } catch (error) {
      alert('Failed to save patient record.');
    }
  };

  // 2. First Checkup Room (Triage)
  const handleOpenCheckup = (patient) => {
    setSelectedPatientForCheckup(patient);
    setCheckupForm({
      vitals: patient.vitals || 'BP: 120/80, Temp: 36.6°C',
      checkup_notes: patient.checkup_notes || '',
      status: 'Checked Up'
    });
    setIsCheckupModalOpen(true);
  };

  const handleCheckupSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatientForCheckup) return;

    try {
      const payload = {
        ...selectedPatientForCheckup,
        vitals: checkupForm.vitals,
        checkup_notes: checkupForm.checkup_notes,
        status: 'Checked Up'
      };
      const response = await API.put(`/patients/${selectedPatientForCheckup.id}`, payload);
      const updated = response.data?.data || response.data;
      setPatients(patients.map(p => (p.id === updated.id ? updated : p)));
      setIsCheckupModalOpen(false);
      alert(`First checkup completed for ${selectedPatientForCheckup.name}! Ready for doctor assignment.`);
    } catch (error) {
      alert('Failed to save checkup data.');
    }
  };

  // 3. Specialist Doctor Assignment Room
  const handleOpenAssign = (patient) => {
    setSelectedPatientForAssign(patient);
    const existingAppt = appointments.find(a => Number(a.patient_id) === Number(patient.id));
    setAssignForm({
      doctor: existingAppt ? existingAppt.doctor : (doctors.length > 0 ? doctors[0].name : ''),
      date: existingAppt ? existingAppt.date : new Date().toISOString().split('T')[0],
      time: existingAppt ? existingAppt.time : '10:00 AM',
      notes: existingAppt ? existingAppt.notes : ''
    });
    setIsAssignModalOpen(true);
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatientForAssign || !assignForm.doctor) return;

    try {
      const payload = {
        patient_id: selectedPatientForAssign.id,
        patientName: selectedPatientForAssign.name,
        doctor: assignForm.doctor,
        date: assignForm.date,
        time: assignForm.time,
        notes: assignForm.notes
      };

      const response = await API.post('/appointments', payload);
      const savedAppt = response.data?.data || response.data;
      const filtered = appointments.filter(a => Number(a.patient_id) !== Number(selectedPatientForAssign.id));
      setAppointments([savedAppt, ...filtered]);

      await API.put(`/patients/${selectedPatientForAssign.id}`, { ...selectedPatientForAssign, status: 'Assigned to Doctor' });
      fetchPatientsBySearch(searchQuery);

      setIsAssignModalOpen(false);
      alert(`Successfully dispatched ${selectedPatientForAssign.name} to Dr. ${assignForm.doctor}!`);
    } catch (error) {
      alert('Failed to assign doctor.');
    }
  };

  const handleDeletePatient = async (id) => {
    if (window.confirm('Delete this patient record?')) {
      try {
        await API.delete(`/patients/${id}`);
        setPatients(patients.filter(p => p.id !== id));
      } catch (error) {
        alert('Failed to delete patient.');
      }
    }
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/doctors', doctorForm);
      setDoctors([res.data?.data || res.data, ...doctors]);
      setIsDoctorModalOpen(false);
      setDoctorForm({ name: '', specialization: '', phone: '', status: 'Active' });
      alert('Doctor registered successfully!');
    } catch (err) {
      alert('Failed to register doctor.');
    }
  };

  const theme = {
    bg: '#f8fafc',
    cardBg: '#ffffff',
    textMain: '#0f172a',
    textMuted: '#64748b',
    primary: '#2563eb',
    border: '#e2e8f0',
  };

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: '100vh', padding: '16px', fontFamily: "'Inter', system-ui, sans-serif", color: theme.textMain, boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>

        {/* Header Banner */}
        <div style={{ backgroundColor: '#ffffff', padding: '20px 24px', borderRadius: '16px', border: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: theme.textMain, margin: '0 0 4px 0' }}>🏥 CLINICAL MANAGEMNT SYSTEM DASHBORD</h1>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={handleOpenRegister} style={{ backgroundColor: theme.primary, color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '10px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
              + Card Room Registration
            </button>
            <button onClick={() => setIsDoctorModalOpen(true)} style={{ backgroundColor: '#ffffff', color: theme.primary, border: `2px solid ${theme.primary}`, padding: '8px 16px', borderRadius: '10px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
              + Register Doctor
            </button>
          </div>
        </div>

        {/* Workflow Pipeline Sub-Tabs */}
        <div style={{ backgroundColor: theme.cardBg, padding: '16px 20px', borderRadius: '16px', border: `1px solid ${theme.border}`, marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => setActiveSubTab('card_room')} style={{ backgroundColor: activeSubTab === 'card_room' ? theme.primary : '#f1f5f9', color: activeSubTab === 'card_room' ? '#ffffff' : theme.textMain, border: 'none', padding: '10px 16px', borderRadius: '10px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
              1. Card Room & Registry ({patients.length})
            </button>
            <button onClick={() => setActiveSubTab('checkup_room')} style={{ backgroundColor: activeSubTab === 'checkup_room' ? theme.primary : '#f1f5f9', color: activeSubTab === 'checkup_room' ? '#ffffff' : theme.textMain, border: 'none', padding: '10px 16px', borderRadius: '10px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
              2. First Checkup Room (Triage)
            </button>
            <button onClick={() => setActiveSubTab('assignment_room')} style={{ backgroundColor: activeSubTab === 'assignment_room' ? theme.primary : '#f1f5f9', color: activeSubTab === 'assignment_room' ? '#ffffff' : theme.textMain, border: 'none', padding: '10px 16px', borderRadius: '10px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
              3. Select Doctor & Assign ({appointments.length})
            </button>
            <button onClick={() => setActiveSubTab('doctors')} style={{ backgroundColor: activeSubTab === 'doctors' ? theme.primary : '#f1f5f9', color: activeSubTab === 'doctors' ? '#ffffff' : theme.textMain, border: 'none', padding: '10px 16px', borderRadius: '10px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
              Doctors ({doctors.length})
            </button>
          </div>

          <div style={{ width: '100%', maxWidth: '260px' }}>
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="🔍 Search patient by name..." 
              style={{ width: '100%', padding: '9px 12px', border: `1px solid ${theme.border}`, borderRadius: '10px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* STAGE 1: CARD ROOM & PATIENT REGISTRY */}
        {activeSubTab === 'card_room' && (
          <div style={{ backgroundColor: theme.cardBg, borderRadius: '16px', border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: `1px solid ${theme.border}` }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Card Room - Patient Registration & Registry</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: `1px solid ${theme.border}` }}>
                    <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: '700', color: theme.textMuted }}>NAME</th>
                    <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: '700', color: theme.textMuted }}>AGE</th>
                    <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: '700', color: theme.textMuted }}>GENDER</th>
                    <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: '700', color: theme.textMuted }}>INITIAL SYMPTOMS</th>
                    <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: '700', color: theme.textMuted }}>STATUS</th>
                    <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: '700', color: theme.textMuted, textAlign: 'center' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.length > 0 ? patients.map(p => (
                    <tr key={p.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={{ padding: '14px 20px', fontWeight: '600' }}>{p.name}</td>
                      <td style={{ padding: '14px 20px' }}>{p.age}</td>
                      <td style={{ padding: '14px 20px' }}>{p.gender}</td>
                      <td style={{ padding: '14px 20px' }}>{p.condition}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>
                          {p.status || 'Pending Checkup'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                        <button onClick={() => handleOpenCheckup(p)} style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', marginRight: '6px', cursor: 'pointer' }}>
                          Send to Checkup ➔
                        </button>
                        <button onClick={() => handleDeletePatient(p.id)} style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="6" style={{ padding: '36px', textAlign: 'center', color: theme.textMuted }}>No registered patients in card room.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STAGE 2: FIRST CHECKUP ROOM (TRIAGE) */}
        {activeSubTab === 'checkup_room' && (
          <div style={{ backgroundColor: theme.cardBg, borderRadius: '16px', border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: `1px solid ${theme.border}` }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>First Checkup Room (Triage Examination)</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: `1px solid ${theme.border}` }}>
                    <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: '700', color: theme.textMuted }}>NAME</th>
                    <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: '700', color: theme.textMuted }}>VITALS RECORDED</th>
                    <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: '700', color: theme.textMuted }}>CHECKUP NOTES</th>
                    <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: '700', color: theme.textMuted }}>STATUS</th>
                    <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: '700', color: theme.textMuted, textAlign: 'center' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.length > 0 ? patients.map(p => (
                    <tr key={p.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={{ padding: '14px 20px', fontWeight: '600' }}>{p.name}</td>
                      <td style={{ padding: '14px 20px', color: '#2563eb', fontWeight: '500' }}>{p.vitals || 'Not Recorded'}</td>
                      <td style={{ padding: '14px 20px' }}>{p.checkup_notes || 'Pending examination'}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ backgroundColor: p.status === 'Checked Up' ? '#dcfce7' : '#fef3c7', color: p.status === 'Checked Up' ? '#166534' : '#92400e', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>
                          {p.status || 'Pending Checkup'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                        <button onClick={() => handleOpenCheckup(p)} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', marginRight: '6px', cursor: 'pointer' }}>
                          Record Vitals
                        </button>
                        <button onClick={() => handleOpenAssign(p)} style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                          Send to Doctor ➔
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="5" style={{ padding: '36px', textAlign: 'center', color: theme.textMuted }}>No patients in checkup room.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STAGE 3: SELECT DOCTOR & ASSIGN */}
        {activeSubTab === 'assignment_room' && (
          <div style={{ backgroundColor: theme.cardBg, borderRadius: '16px', border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: `1px solid ${theme.border}` }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Select Specialist Doctor & Assign Patient</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: `1px solid ${theme.border}` }}>
                    <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: '700', color: theme.textMuted }}>PATIENT</th>
                    <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: '700', color: theme.textMuted }}>ASSIGNED DOCTOR</th>
                    <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: '700', color: theme.textMuted }}>APPOINTMENT DATE</th>
                    <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: '700', color: theme.textMuted }}>TRIAGE NOTES</th>
                    <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: '700', color: theme.textMuted, textAlign: 'center' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(p => {
                    const appt = appointments.find(a => Number(a.patient_id) === Number(p.id));
                    return (
                      <tr key={p.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                        <td style={{ padding: '14px 20px', fontWeight: '600' }}>{p.name}</td>
                        <td style={{ padding: '14px 20px', color: '#2563eb', fontWeight: '600' }}>{appt ? `Dr. ${appt.doctor}` : 'Unassigned'}</td>
                        <td style={{ padding: '14px 20px' }}>{appt ? `${appt.date} at ${appt.time}` : 'N/A'}</td>
                        <td style={{ padding: '14px 20px' }}>{appt?.notes || p.checkup_notes || 'N/A'}</td>
                        <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                          <button onClick={() => handleOpenAssign(p)} style={{ backgroundColor: theme.primary, color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                            {appt ? 'Reassign Doctor' : 'Select Doctor & Assign'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DOCTORS TAB */}
        {activeSubTab === 'doctors' && (
          <div style={{ backgroundColor: theme.cardBg, borderRadius: '16px', border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: `1px solid ${theme.border}` }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Registered Specialist Doctors</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: `1px solid ${theme.border}` }}>
                  <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: '700', color: theme.textMuted }}>NAME</th>
                  <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: '700', color: theme.textMuted }}>SPECIALIZATION</th>
                  <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: '700', color: theme.textMuted }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map(d => (
                  <tr key={d.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <td style={{ padding: '14px 20px', fontWeight: '600' }}>{d.name}</td>
                    <td style={{ padding: '14px 20px' }}>{d.specialization || d.specialty}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>
                        {d.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal: Card Room Patient Registration */}
        {isPatientModalOpen && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '400px', border: `1px solid ${theme.border}` }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700' }}>Card Room - Register Patient</h3>
              <form onSubmit={handlePatientSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input type="text" placeholder="Full Name" value={patientForm.name} onChange={(e) => setPatientForm({...patientForm, name: e.target.value})} required style={{ padding: '9px 12px', borderRadius: '8px', border: `1px solid ${theme.border}` }} />
                <input type="number" placeholder="Age" value={patientForm.age} onChange={(e) => setPatientForm({...patientForm, age: e.target.value})} required style={{ padding: '9px 12px', borderRadius: '8px', border: `1px solid ${theme.border}` }} />
                <select value={patientForm.gender} onChange={(e) => setPatientForm({...patientForm, gender: e.target.value})} style={{ padding: '9px 12px', borderRadius: '8px', border: `1px solid ${theme.border}` }}>
                <option value="Male">Gender:</option>
                    <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <input type="text" placeholder="Initial Symptoms / Condition" value={patientForm.condition} onChange={(e) => setPatientForm({...patientForm, condition: e.target.value})} required style={{ padding: '9px 12px', borderRadius: '8px', border: `1px solid ${theme.border}` }} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setIsPatientModalOpen(false)} style={{ padding: '9px 16px', border: `1px solid ${theme.border}`, backgroundColor: '#fff', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ padding: '9px 16px', backgroundColor: theme.primary, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Save & Register</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: First Checkup Room (Triage) */}
        {isCheckupModalOpen && selectedPatientForCheckup && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '400px', border: `1px solid ${theme.border}` }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700' }}>First Checkup Room: {selectedPatientForCheckup.name}</h3>
              <form onSubmit={handleCheckupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Vitals (BP, Pulse, Temp):</label>
                  <input type="text" value={checkupForm.vitals} onChange={(e) => setCheckupForm({...checkupForm, vitals: e.target.value})} required style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${theme.border}`, boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Checkup Findings / Notes:</label>
                  <textarea rows="3" value={checkupForm.checkup_notes} onChange={(e) => setCheckupForm({...checkupForm, checkup_notes: e.target.value})} placeholder="Enter preliminary findings..." style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${theme.border}`, boxSizing: 'border-box' }}></textarea>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setIsCheckupModalOpen(false)} style={{ padding: '9px 16px', border: `1px solid ${theme.border}`, backgroundColor: '#fff', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ padding: '9px 16px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Complete Checkup</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Select Doctor & Assign */}
        {isAssignModalOpen && selectedPatientForAssign && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '400px', border: `1px solid ${theme.border}` }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700' }}>Select Doctor for: {selectedPatientForAssign.name}</h3>
              <form onSubmit={handleAssignSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Select Specialist Doctor:</label>
                  <select value={assignForm.doctor} onChange={(e) => setAssignForm({...assignForm, doctor: e.target.value})} required style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${theme.border}`, boxSizing: 'border-box' }}>
                    <option value="">Select Doctor</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.name}>{d.name} ({d.specialization || d.specialty})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Appointment Date:</label>
                  <input type="date" value={assignForm.date} onChange={(e) => setAssignForm({...assignForm, date: e.target.value})} required style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${theme.border}`, boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Triage Notes / Orders:</label>
                  <input type="text" value={assignForm.notes} onChange={(e) => setAssignForm({...assignForm, notes: e.target.value})} placeholder="Notes for the specialist..." style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${theme.border}`, boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setIsAssignModalOpen(false)} style={{ padding: '9px 16px', border: `1px solid ${theme.border}`, backgroundColor: '#fff', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ padding: '9px 16px', backgroundColor: theme.primary, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Dispatch to Doctor</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Register Doctor */}
        {isDoctorModalOpen && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '400px', border: `1px solid ${theme.border}` }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700' }}>Register New Doctor</h3>
              <form onSubmit={handleDoctorSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input type="text" placeholder="Doctor Name" value={doctorForm.name} onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})} required style={{ padding: '9px 12px', borderRadius: '8px', border: `1px solid ${theme.border}` }} />
                <input type="text" placeholder="Specialization (e.g. Cardiology)" value={doctorForm.specialization} onChange={(e) => setDoctorForm({...doctorForm, specialization: e.target.value})} required style={{ padding: '9px 12px', borderRadius: '8px', border: `1px solid ${theme.border}` }} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setIsDoctorModalOpen(false)} style={{ padding: '9px 16px', border: `1px solid ${theme.border}`, backgroundColor: '#fff', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ padding: '9px 16px', backgroundColor: theme.primary, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Save Doctor</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}