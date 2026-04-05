import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projets from './pages/Projets';

// --- Placeholder pages for modules coming soon ---
const ModulePage = ({ title, subtitle, icon }) => (
  <div className="p-6 md:p-8">
    <div className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle || 'Module en développement'}</p>
      </div>
    </div>
    <div className="card p-16 text-center">
      <div className="empty-state">
        <div className="empty-state-icon mx-auto mb-4" style={{ width: 72, height: 72, background: '#fff7ed', borderRadius: '50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontSize: 32 }}>{icon || '🚧'}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">Ce module est en cours de développement et sera disponible prochainement.</p>
      </div>
    </div>
  </div>
);

const modules = {
  '/achats':    { title: 'Achats & Fournisseurs', subtitle: 'Commandes, livraisons, factures et paiements', icon: '🛒' },
  '/stocks':    { title: 'Stocks & Matériaux', subtitle: 'Catalogue, mouvements et inventaires', icon: '📦' },
  '/rh':        { title: 'Ressources Humaines', subtitle: 'Employés, pointage, congés et avances', icon: '👥' },
  '/paie':      { title: 'Paie & Bulletins', subtitle: 'Bulletins de paie, IRG/CNAS, livre de paie', icon: '💰' },
  '/materiel':  { title: 'Immobilisations', subtitle: 'Matériel, affectations et maintenances', icon: '🚛' },
  '/commercial':{ title: 'Commercial Clients', subtitle: 'Lots, contrats de vente, échéanciers', icon: '🏠' },
  '/depenses':  { title: 'Dépenses & Charges', subtitle: 'Dépenses directes, charges fixes, sous-traitance', icon: '📊' },
  '/finances':  { title: 'Finances & Budget', subtitle: 'Suivi budgétaire, reporting et KPIs', icon: '📈' },
  '/settings':  { title: 'Paramètres', subtitle: 'Configuration entreprise et utilisateurs', icon: '⚙️' },
};

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
            {Object.entries(modules).map(([path, { title, subtitle, icon }]) => (
              <Route key={path} path={path} element={<ModulePage title={title} subtitle={subtitle} icon={icon} />} />
            ))}
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
