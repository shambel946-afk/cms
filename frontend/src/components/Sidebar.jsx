import React from 'react';

export default function Sidebar({ currentTab, setCurrentTab, isAdminAuthenticated, setIsAdminAuthenticated }) {
  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentTab('patient-page');
  };

  const theme = {
    sidebarBg: '#ffffff',
    textMain: '#112a0e',
    border: 'rgb(226, 232, 240)',
    primary: '#2563eb',
    primaryBg: '#eff6ff',
    logoutBg: '#fef2f2',
    logoutText: '#2cad9c',
    logoutBorder: '#fecaca'
  };

  const getNavItemStyle = (tabName) => {
    const isActive = currentTab === tabName;
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      width: '100%',
      backgroundColor: isActive ? theme.primary : 'transparent',
      color: isActive ? '#ffffff' : theme.textMain,
      border: 'none',
      padding: '10px 14px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '13px',
      textAlign: 'left',
      boxSizing: 'border-box'
    };
  };

  return (
    <aside style={{
      width: '240px',
      minWidth: '240px',
      backgroundColor: theme.sidebarBg,
      borderRight: `1px solid ${theme.border}`,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '20px 16px',
      boxSizing: 'border-box'
    }}>
      <div>
        {/* Logo and Clinic Title Centered at Top */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '20px', textAlign: 'center' }}>
          <img 
            src="/logo.png" 
            alt="Daruselam Clinic Logo" 
            style={{ width: '70px', height: '70px', objectFit: 'contain', marginBottom: '8px', borderRadius: '50%' }} 
          />
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: theme.textMain }}>
            DARUSELAM MEDIUM CLINIC
          </h3>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {/* Main Dashboard Link */}
          <button onClick={() => setCurrentTab('admin-dashboard')} style={getNavItemStyle('admin-dashboard')}>
            📊 Admin Dashboard
          </button>

          {/* Workflow Steps */}
          <button onClick={() => setCurrentTab('card-room-page')} style={getNavItemStyle('card-room-page')}>
            📝 Card Room & Registry
          </button>
          <button onClick={() => setCurrentTab('first-checkup-page')} style={getNavItemStyle('first-checkup-page')}>
            🩺 First Checkup Room 
          </button>
          <button onClick={() => setCurrentTab('select-doctor-page')} style={getNavItemStyle('select-doctor-page')}>
            👨‍⚕️ Select Doctor & Assign
          </button>

          {/* Existing Navigation Links */}
          <button onClick={() => setCurrentTab('doctor-page')} style={getNavItemStyle('doctor-page')}>
            📋 Doctor's Daily Orders
          </button>
          <button onClick={() => setCurrentTab('patient-page')} style={getNavItemStyle('patient-page')}>
            👤 Patient Page
          </button>
          <button onClick={() => setCurrentTab('pharmacy-page')} style={getNavItemStyle('pharmacy-page')}>
            💊 Pharmacy System
          </button>
          <button onClick={() => setCurrentTab('payment-page')} style={getNavItemStyle('payment-page')}>
            💳 Payment & Billing
          </button>
          <button onClick={() => setCurrentTab('xray-page')} style={getNavItemStyle('xray-page')}>
            🩻 X-Ray Room
          </button>
          <button onClick={() => setCurrentTab('ultrasound-page')} style={getNavItemStyle('ultrasound-page')}>
            📡 Ultrasound Room
          </button>
          <button onClick={() => setCurrentTab('lab-page')} style={getNavItemStyle('lab-page')}>
            🔬 Medical Laboratory
          </button>
        </nav>
      </div>

      <div style={{ paddingTop: '16px', borderTop: `1px solid ${theme.border}` }}>
        {isAdminAuthenticated && currentTab === 'admin-dashboard' ? (
          <button onClick={handleLogout} style={{ width: '100%', backgroundColor: theme.logoutBg, border: `1px solid ${theme.logoutBorder}`, color: theme.logoutText, padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
            🚪 Admin Logout
          </button>
        ) : (
          <button onClick={() => setCurrentTab('patient-page')} style={{ width: '100%', backgroundColor: theme.primaryBg, border: `1px solid #bfdbfe`, color: theme.primary, padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
            🏠 Patient Portal Home
          </button>
        )}
      </div>
    </aside>
  );
}