import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projets from './pages/Projets';
import Achats from './pages/Achats';
import Stocks from './pages/Stocks';
import RH from './pages/RH';
import Paie from './pages/Paie';
import Materiel from './pages/Materiel';
import Commercial from './pages/Commercial';
import Depenses from './pages/Depenses';
import Finances from './pages/Finances';
import Settings from './pages/Settings';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('btp_user');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch(e) { localStorage.removeItem('btp_user'); }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('btp_user', JSON.stringify(userData));
    setUser(userData);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('btp_user');
    localStorage.removeItem('btp_token');
    setUser(null);
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f5f7' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="animate-spin" style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTopColor: '#E07B2A', borderRadius: '50%', margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b', fontSize: 14 }}>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const sidebarWidth = sidebarOpen ? '240px' : '72px';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f5f7' }}>
      <Sidebar isOpen={sidebarOpen} user={user} onLogout={handleLogout} />
      <div style={{ marginLeft: sidebarWidth, flex: 1, display: 'flex', flexDirection: 'column', transition: 'margin-left 0.3s', minWidth: 0 }}>
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} user={user} />
        <main style={{ flex: 1, overflow: 'auto' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/projets" element={<Projets />} />
            <Route path="/projets/:id" element={<Projets />} />
            <Route path="/achats" element={<Achats />} />
            <Route path="/stocks" element={<Stocks />} />
            <Route path="/rh" element={<RH />} />
            <Route path="/paie" element={<Paie />} />
            <Route path="/materiel" element={<Materiel />} />
            <Route path="/commercial" element={<Commercial />} />
            <Route path="/depenses" element={<Depenses />} />
            <Route path="/finances" element={<Finances />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={
              <div className="p-8 text-center">
                <h2 className="text-xl font-bold text-gray-600">404 — Page introuvable</h2>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
