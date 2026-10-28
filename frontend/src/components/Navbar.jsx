import React from 'react';

export default function Sidebar({ currentTab, setCurrentTab, isAdminAuthenticated, setIsAdminAuthenticated }) {
  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentTab('patient-page');
  };

  const theme = {
    sidebarBg: '#ffffff',
    textMain: '#0f172a',
    border: '#e2e8f0',
    primary: '#2563eb',
    primaryBg: '#eff6ff',
    logoutBg: '#fef2f2',
    logoutText: '#dc2626',
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
      boxSizing: 'border-box',
      transition: 'all 0.2s ease'
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
      boxSizing: 'border-box',
      boxShadow: '2px 0 6px rgba(0, 0, 0, 0.02)'
    }}>
      {/* Top Section: Title & Vertical Navigation Links */}
      <div>
        <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: theme.textMain, lineHeight: '1.4' }}>
            🏥 DARUSELAM CLINIC
          </h3>
        </div>

        {/* Vertical Menu Buttons */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            onClick={() => setCurrentTab('admin-dashboard')}
            style={getNavItemStyle('admin-dashboard')}
          >
            📊 Admin Dashboard
          </button>
          <button
            onClick={() => setCurrentTab('doctor-page')}
            style={getNavItemStyle('doctor-page')}
          >
            👨‍⚕️ Doctor's Daily Orders
          </button>
          <button
            onClick={() => setCurrentTab('patient-page')}
            style={getNavItemStyle('patient-page')}
          >
            📋 Patient Page
          </button>
        </nav>
      </div>

      {/* Bottom Section: Action / Logout Button */}
      <div style={{ paddingTop: '16px', borderTop: `1px solid ${theme.border}` }}>
        {isAdminAuthenticated && currentTab === 'admin-dashboard' ? (
          <button 
            onClick={handleLogout}
            style={{
              width: '100%',
              backgroundColor: theme.logoutBg,
              border: `1px solid ${theme.logoutBorder}`,
              color: theme.logoutText,
              padding: '10px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              textAlign: 'center',
              boxSizing: 'border-box'
            }}
          >
            🚪 Admin Logout
          </button>
        ) : (
          <button 
            onClick={() => setCurrentTab('patient-page')}
            style={{
              width: '100%',
              backgroundColor: theme.primaryBg,
              border: `1px solid #bfdbfe`,
              color: theme.primary,
              padding: '10px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              textAlign: 'center',
              boxSizing: 'border-box'
            }}
          >
            🏠 Patient Portal Home
          </button>
        )}
      </div>
    </aside>
  );
}