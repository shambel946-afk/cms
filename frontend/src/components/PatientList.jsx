import React, { useState } from 'react';

export default function PatientsList({ patients = [], setPatients = () => {} }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Female',
    condition: '',
    status: 'Stable'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenAdd = () => {
    setEditingPatientId(null);
    setFormData({ name: '', age: '', gender: 'Female', condition: '', status: 'Stable' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (patient) => {
    setEditingPatientId(patient.id);
    setFormData({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      condition: patient.condition,
      status: patient.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setPatients(patients.filter(patient => patient.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.condition) return;

    if (editingPatientId !== null) {
      setPatients(patients.map(patient => 
        patient.id === editingPatientId 
          ? { ...patient, ...formData, age: Number(formData.age) }
          : patient
      ));
    } else {
      const newPatient = {
        id: Date.now(),
        name: formData.name,
        age: Number(formData.age),
        gender: formData.gender,
        condition: formData.condition,
        status: formData.status
      };
      setPatients([newPatient, ...patients]);
    }

    setFormData({ name: '', age: '', gender: 'Female', condition: '', status: 'Stable' });
    setEditingPatientId(null);
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: 'var(--text-h)', margin: 0 }}>Patient Management System</h2>
        <button 
          onClick={handleOpenAdd}
          style={{
            background: 'var(--accent)',
            color: '#fff',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          + Add New Patient
        </button>
      </div>

      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--code-bg)' }}>
              <th style={{ padding: '12px' }}>Name</th>
              <th style={{ padding: '12px' }}>Age</th>
              <th style={{ padding: '12px' }}>Gender</th>
              <th style={{ padding: '12px' }}>Condition</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: 'var(--text)' }}>
                  No patients registered yet. Click "+ Add New Patient" to add one.
                </td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr key={patient.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px', fontWeight: '500', color: 'var(--text-h)' }}>{patient.name}</td>
                  <td style={{ padding: '12px' }}>{patient.age}</td>
                  <td style={{ padding: '12px' }}>{patient.gender}</td>
                  <td style={{ padding: '12px' }}>{patient.condition}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      background: 'var(--accent-bg)',
                      color: 'var(--text-h)',
                      border: '1px solid var(--accent-border)'
                    }}>
                      {patient.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button 
                      onClick={() => handleOpenEdit(patient)}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--border)',
                        color: 'var(--text-h)',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '6px',
                        fontSize: '12px'
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(patient.id)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#ef4444',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            padding: '24px',
            borderRadius: '12px',
            width: '400px',
            boxShadow: 'var(--shadow)',
            textAlign: 'left'
          }}>
            <h3 style={{ marginTop: 0, color: 'var(--text-h)' }}>
              {editingPatientId !== null ? 'Edit Patient Details' : 'Register New Patient'}
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required
                  style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px', background: 'var(--bg)', color: 'var(--text-h)' }}
                  placeholder="e.g. John Doe"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Age</label>
                  <input 
                    type="number" 
                    name="age" 
                    value={formData.age} 
                    onChange={handleChange} 
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px', background: 'var(--bg)', color: 'var(--text-h)' }}
                    placeholder="e.g. 30"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Gender</label>
                  <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px', background: 'var(--bg)', color: 'var(--text-h)' }}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Condition</label>
                <input 
                  type="text" 
                  name="condition" 
                  value={formData.condition} 
                  onChange={handleChange} 
                  required
                  style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px', background: 'var(--bg)', color: 'var(--text-h)' }}
                  placeholder="e.g. Asthma"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Status</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange}
                  style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px', background: 'var(--bg)', color: 'var(--text-h)' }}
                >
                  <option value="Stable">Stable</option>
                  <option value="Under Observation">Under Observation</option>
                  <option value="Recovered">Recovered</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '8px 16px', border: '1px solid var(--border)', background: 'var(--code-bg)', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-h)' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ padding: '8px 16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  {editingPatientId !== null ? 'Update Changes' : 'Save Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}