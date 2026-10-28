import React, { useState } from 'react';

export default function UltrasoundPage({ messages = [], setMessages }) {
  const [replyText, setReplyText] = useState({});

  const handleSendReply = (msgId) => {
    const reply = replyText[msgId];
    if (!reply) {
      alert('Please type an ultrasound result before sending!');
      return;
    }

    const updated = messages.map(m => {
      if (m.id === msgId) {
        return { ...m, reply };
      }
      return m;
    });

    setMessages(updated);
    alert('Ultrasound result successfully sent back to Doctor!');
  };

  const ultrasoundMessages = messages.filter(m => m.recipient === 'Ultrasound Technician');

  return (
    <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: '#0f172a' }}>
        📡 Ultrasound Room - Staff Dashboard & Messages
      </h2>

      <div style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: '#0f172a' }}>
          📥 Incoming Patient Ultrasound Inquiries ({ultrasoundMessages.length})
        </h3>
        {ultrasoundMessages.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>No messages from doctors yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {ultrasoundMessages.map(m => (
              <div key={m.id} style={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', padding: '16px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <strong style={{ color: '#2563eb' }}>
                    {m.sender} ➔ Patient: <span style={{ color: '#0f172a', textDecoration: 'underline' }}>{m.patientName}</span>
                  </strong>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{m.time}</span>
                </div>
                <p style={{ margin: '0 0 12px 0', color: '#0f172a', fontSize: '14px' }}>{m.message}</p>
                
                {m.reply ? (
                  <div style={{ fontSize: '13px', color: '#059669', fontWeight: '600', backgroundColor: '#dcfce7', padding: '8px', borderRadius: '6px' }}>
                    ✓ Result Sent Back: {m.reply}
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <input 
                      type="text" 
                      placeholder="Type ultrasound test result..." 
                      value={replyText[m.id] || ''}
                      onChange={e => setReplyText({...replyText, [m.id]: e.target.value})}
                      style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', flex: 1 }}
                    />
                    <button 
                      onClick={() => handleSendReply(m.id)}
                      style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer', fontWeight: '600' }}
                    >
                      Send Result Back ➔
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}