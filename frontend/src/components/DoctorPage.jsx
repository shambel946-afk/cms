import React, { useState } from 'react';

export default function DoctorPage({ 
  appointments = [], 
  patients = [], 
  doctors = [], 
  labOrders = [], 
  setLabOrders, 
  messages = [], 
  setMessages 
}) {
  const [activeSubTab, setActiveSubTab] = useState('messaging');
  const [messageForm, setMessageForm] = useState({ recipient: '', patientName: '', message: '' });

  // Split messages into Sent and Received for the UI
  const sentMessages = messages.filter(m => m.direction === 'sent' || !m.direction); 
  const receivedMessages = messages.filter(m => m.direction === 'received');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageForm.recipient || !messageForm.message) {
      alert('Please select a department recipient and type a message!');
      return;
    }

    const newMessage = {
      id: Date.now(),
      sender: 'Dr. Berku',
      recipient: messageForm.recipient,
      patientName: messageForm.patientName || 'General / None',
      message: messageForm.message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      direction: 'sent',
      reply: '' // Holds staff reply when sent back
    };

    setMessages([newMessage, ...messages]);
    alert(`Message successfully sent to ${messageForm.recipient}!`);
    
    // Clear form
    setMessageForm({ recipient: '', patientName: '', message: '' });
  };

  const handleReplyClick = (msg) => {
    setMessageForm({
      recipient: msg.sender, 
      patientName: msg.patientName || '',
      message: '' 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const simulateStaffReply = () => {
    const mockReply = {
      id: Date.now(),
      sender: 'Laboratorist',
      recipient: 'Dr. Berku',
      patientName: 'John Doe',
      message: 'Doctor, the blood test results for John Doe are ready. Please review.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      direction: 'received'
    };
    setMessages([mockReply, ...messages]);
  };

  return (
    <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
          👨‍⚕️ Doctor's Dashboard & Staff Messaging
        </h2>
        <button onClick={simulateStaffReply} style={{ padding: '6px 12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
          [Test] Simulate Staff Reply
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <button 
          onClick={() => setActiveSubTab('messaging')} 
          style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', backgroundColor: activeSubTab === 'messaging' ? '#2563eb' : '#e2e8f0', color: activeSubTab === 'messaging' ? '#fff' : '#475569' }}
        >
          💬 Staff Messaging
        </button>
      </div>

      {activeSubTab === 'messaging' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Send Form */}
          <div style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#0f172a' }}>
              {messageForm.recipient ? `Reply to ${messageForm.recipient}` : 'Exchange Messages with Department Staff'}
            </h3>
            <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '500px' }}>
              
              <select 
                value={messageForm.recipient} 
                onChange={e => setMessageForm({...messageForm, recipient: e.target.value})} 
                required 
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              >
                <option value="">Select Department Staff:</option>
                <option value="Laboratorist">Laboratorist</option>
                <option value="Radiologist">Radiologist</option>
                <option value="Pharmacist">Pharmacist</option>
                <option value="Ultrasound Technician">Ultrasound Technician</option>
                <option value="Cashier">Cashier</option>
              </select>

              <select 
                value={messageForm.patientName} 
                onChange={e => setMessageForm({...messageForm, patientName: e.target.value})} 
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              >
                <option value=""> Select Patient:</option>
                {patients.map((p, idx) => (
                  <option key={idx} value={p.name || p.full_name}>
                    {p.name || p.full_name} (Age: {p.age})
                  </option>
                ))}
              </select>

              <textarea 
                placeholder="Type your message or notes regarding this patient..." 
                rows="3" 
                value={messageForm.message} 
                onChange={e => setMessageForm({...messageForm, message: e.target.value})} 
                required 
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
                  Send Message ➔
                </button>
                {messageForm.recipient && (
                   <button type="button" onClick={() => setMessageForm({ recipient: '', patientName: '', message: '' })} style={{ padding: '10px 20px', backgroundColor: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
                     Cancel Reply
                   </button>
                )}
              </div>
            </form>
          </div>

          {/* INBOX: Received Messages */}
          <div style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#0f172a' }}>📥 Inbox (Messages from Staff)</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #cbd5e1', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '10px' }}>SENDER</th>
                  <th style={{ padding: '10px' }}>PATIENT NAME</th>
                  <th style={{ padding: '10px' }}>MESSAGE</th>
                  <th style={{ padding: '10px' }}>TIME</th>
                  <th style={{ padding: '10px' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {receivedMessages.length === 0 ? (
                  <tr><td colSpan="5" style={{ padding: '16px', color: '#64748b', textAlign: 'center' }}>No new messages from staff.</td></tr>
                ) : (
                  receivedMessages.map(m => (
                    <tr key={m.id} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                      <td style={{ padding: '12px', fontWeight: '600', color: '#059669' }}>{m.sender}</td>
                      <td style={{ padding: '12px', fontWeight: '600', color: '#2563eb' }}>{m.patientName}</td>
                      <td style={{ padding: '12px' }}>{m.message}</td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{m.time}</td>
                      <td style={{ padding: '12px' }}>
                        <button onClick={() => handleReplyClick(m)} style={{ padding: '4px 10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                          Reply
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* OUTBOX: Sent Messages History with Staff Reply Column */}
          <div style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#0f172a' }}>📤 Sent Messages & Replies History</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '10px' }}>RECIPIENT</th>
                  <th style={{ padding: '10px' }}>PATIENT NAME</th>
                  <th style={{ padding: '10px' }}>DOCTOR MESSAGE</th>
                  <th style={{ padding: '10px' }}>STAFF REPLY</th>
                  <th style={{ padding: '10px' }}>TIME</th>
                </tr>
              </thead>
              <tbody>
                {sentMessages.length === 0 ? (
                  <tr><td colSpan="5" style={{ padding: '16px', color: '#64748b', textAlign: 'center' }}>No messages sent yet.</td></tr>
                ) : (
                  sentMessages.map(m => (
                    <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: '600' }}>{m.recipient}</td>
                      <td style={{ padding: '12px', fontWeight: '600', color: '#2563eb' }}>{m.patientName}</td>
                      <td style={{ padding: '12px' }}>{m.message}</td>
                      <td style={{ padding: '12px', fontWeight: '600', color: m.reply ? '#059669' : '#d97706' }}>
                        {m.reply ? `✓ ${m.reply}` : 'Awaiting reply...'}
                      </td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{m.time}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );
}