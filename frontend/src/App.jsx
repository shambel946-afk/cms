import React, { useState, lazy, Suspense, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import PharmacyPage from './components/PharmacyPage';
import PaymentPage from './components/PaymentPage';
import XrayPage from './components/XrayPage';
import UltrasoundPage from './components/UltrasoundPage';
import LabPage from './components/LabPage';
import './App.css';

const Dashboard = lazy(() => import('./components/Dashboard'));
const PatientPage = lazy(() => import('./components/PatientPage'));
const DoctorPage = lazy(() => import('./components/DoctorPage'));

function App() {
  const [currentTab, setCurrentTab] = useState('patient-page');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [labOrders, setLabOrders] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/patients')
      .then(res => setPatients(Array.isArray(res.data) ? res.data : (res.data.data || [])))
      .catch(err => console.error(err));

    axios.get('http://127.0.0.1:8000/api/doctors')
      .then(res => setDoctors(Array.isArray(res.data) ? res.data : (res.data.data || [])))
      .catch(err => console.error(err));

    axios.get('http://127.0.0.1:8000/api/appointments')
      .then(res => setAppointments(Array.isArray(res.data) ? res.data : (res.data.data || [])))
      .catch(err => console.error(err));
  }, []);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/admin/login', loginForm);
      if (response.data.success) {
        setIsAdminAuthenticated(true);
        setCurrentTab('admin-dashboard');
      }
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Invalid username or password!');
    }
  };

  const handleTabChange = (tab) => {
    if (tab === 'admin-dashboard' && !isAdminAuthenticated) {
      setCurrentTab('admin-login');
    } else {
      setCurrentTab(tab);
    }
  };

  return (
    <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', backgroundColor: '#f8fafc', margin: 0, padding: 0 }}>
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={handleTabChange} 
        isAdminAuthenticated={isAdminAuthenticated} 
        setIsAdminAuthenticated={setIsAdminAuthenticated} 
      />

      <main style={{ flex: 1, minWidth: 0, padding: '24px', backgroundColor: '#f8fafc', overflowY: 'auto' }}>
        <Suspense fallback={<div style={{ padding: '20px', fontWeight: '600' }}>Loading...</div>}>
          
          {/* Admin Login View */}
          {currentTab === 'admin-login' && !isAdminAuthenticated && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '32px', borderRadius: '16px', width: '380px' }}>
                <h3 style={{ marginTop: 0, color: '#0f172a' }}>Admin Login Required</h3>
                {loginError && <div style={{ color: '#dc2626', marginBottom: '12px' }}>{loginError}</div>}
                <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <input type="text" placeholder="Username" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <input type="password" placeholder="Password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <button type="submit" style={{ padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Login to Dashboard</button>
                </form>
              </div>
            </div>
          )}

          {/* Admin Dashboard */}
          {currentTab === 'admin-dashboard' && isAdminAuthenticated && (
            <Dashboard patients={patients} setPatients={setPatients} doctors={doctors} setDoctors={setDoctors} appointments={appointments} setAppointments={setAppointments} />
          )}

          {/* Card Room - Patient Registration & Registry */}
          {currentTab === 'card-room-page' && (
            <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: '#0f172a' }}>Card Room - Patient Registration & Registry</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                    <th style={{ padding: '12px' }}>NAME</th>
                    <th style={{ padding: '12px' }}>AGE</th>
                    <th style={{ padding: '12px' }}>GENDER</th>
                    <th style={{ padding: '12px' }}>SYMPTOMS</th>
                    <th style={{ padding: '12px' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: '600' }}>{p.name || p.full_name}</td>
                      <td style={{ padding: '12px' }}>{p.age}</td>
                      <td style={{ padding: '12px' }}>{p.gender}</td>
                      <td style={{ padding: '12px' }}>
                        {p.symptoms || p.initial_symptoms || p.complaints || p.initial_complaints || p.symptom || 'N/A'}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                          {p.status || 'Pending Checkup'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* First Checkup Room (Triage & Vitals) */}
          {currentTab === 'first-checkup-page' && (
            <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#0f172a' }}>🩺 First Checkup Room (Triage & Vitals)</h2>
              <p style={{ color: '#64748b', marginBottom: '20px' }}>Record patient vital signs and manage triage queue.</p>
              
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                    <th style={{ padding: '12px' }}>NAME</th>
                    <th style={{ padding: '12px' }}>AGE</th>
                    <th style={{ padding: '12px' }}>GENDER</th>
                    <th style={{ padding: '12px' }}>SYMPTOMS</th>
                    <th style={{ padding: '12px' }}>STATUS</th>
                    <th style={{ padding: '12px' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.length === 0 ? (
                    <tr><td colSpan="6" style={{ padding: '16px', color: '#64748b', textAlign: 'center' }}>No patients found.</td></tr>
                  ) : (
                    patients.map((p, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px', fontWeight: '600' }}>{p.name || p.full_name}</td>
                        <td style={{ padding: '12px' }}>{p.age}</td>
                        <td style={{ padding: '12px' }}>{p.gender}</td>
                        <td style={{ padding: '12px' }}>
                          {p.symptoms || p.initial_symptoms || p.complaints || p.initial_complaints || p.symptom || 'N/A'}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ backgroundColor: '#dcfce7', color: '#059669', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                            {p.status || 'Ready for Triage'}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <button 
                            onClick={() => {
                              const bp = prompt('Enter Blood Pressure (e.g., 120/80):', '120/80');
                              const temp = prompt('Enter Temperature (°C):', '36.5');
                              if (bp && temp) {
                                const updated = patients.map((item, i) => i === idx ? { ...item, status: 'Vitals Recorded' } : item);
                                setPatients(updated);
                                alert(`Vitals recorded for ${p.name || p.full_name}: BP ${bp}, Temp ${temp}°C`);
                              }
                            }}
                            style={{ padding: '6px 12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}
                          >
                            Record Vitals
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Select Specialist Doctor & Assign */}
          {currentTab === 'select-doctor-page' && (
            <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#0f172a' }}>👨‍⚕️ Select Specialist Doctor & Assign</h2>
              <p style={{ color: '#64748b', marginBottom: '20px' }}>Assign triaged patients to doctors.</p>
              
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                    <th style={{ padding: '12px' }}>PATIENT NAME</th>
                    <th style={{ padding: '12px' }}>SYMPTOMS</th>
                    <th style={{ padding: '12px' }}>STATUS</th>
                    <th style={{ padding: '12px' }}>ASSIGN DOCTOR & ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.length === 0 ? (
                    <tr><td colSpan="4" style={{ padding: '16px', color: '#64748b', textAlign: 'center' }}>No patients found.</td></tr>
                  ) : (
                    patients.map((p, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px', fontWeight: '600' }}>{p.name || p.full_name}</td>
                        <td style={{ padding: '12px' }}>
                          {p.symptoms || p.initial_symptoms || p.complaints || p.initial_complaints || p.symptom || 'N/A'}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                            {p.status || 'Ready for Assignment'}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <button 
                            onClick={() => {
                              const docName = prompt('Enter Doctor Name to Assign (e.g., Dr. Berku):', 'Dr. Berku');
                              if (docName) {
                                const updated = patients.map((item, i) => i === idx ? { ...item, status: `Assigned to ${docName}` } : item);
                                setPatients(updated);
                                alert(`Patient ${p.name || p.full_name} successfully assigned to ${docName}!`);
                              }
                            }}
                            style={{ padding: '6px 12px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}
                          >
                            Assign Doctor
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Doctor Dashboard */}
          {currentTab === 'doctor-page' && (
            <DoctorPage 
              appointments={appointments} 
              patients={patients} 
              doctors={doctors} 
              labOrders={labOrders} 
              setLabOrders={setLabOrders} 
              messages={messages} 
              setMessages={setMessages} 
            />
          )}

          {currentTab === 'patient-page' && <PatientPage patients={patients} setPatients={setPatients} appointments={appointments} setAppointments={setAppointments} doctors={doctors} />}
          
          {/* Pharmacy System Connected with Messages */}
          {currentTab === 'pharmacy-page' && (
            <PharmacyPage 
              messages={messages} 
              setMessages={setMessages} 
            />
          )}

          {/* Payment & Billing Connected with Messages */}
          {currentTab === 'payment-page' && (
            <PaymentPage 
              messages={messages} 
              setMessages={setMessages} 
            />
          )}

          {/* X-Ray and Ultrasound Pages Connected with Messages */}
          {currentTab === 'xray-page' && (
            <XrayPage 
              messages={messages} 
              setMessages={setMessages} 
            />
          )}
          {currentTab === 'ultrasound-page' && (
            <UltrasoundPage 
              messages={messages} 
              setMessages={setMessages} 
            />
          )}
          
          {/* Medical Laboratory Staff Dashboard */}
          {currentTab === 'lab-page' && (
            <LabPage 
              labOrders={labOrders} 
              setLabOrders={setLabOrders} 
              messages={messages} 
              setMessages={setMessages} 
            />
          )}

        </Suspense>
      </main>
    </div>
  );
}

export default App;