import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MarchesPublics from './pages/MarchesPublics';
import Projets from './pages/Projets';
import ChantierMode from './pages/ChantierMode';
import Documents from './pages/Documents';
import Achats from './pages/Achats';
import Finance from './pages/Finance';
import Settings from './pages/Settings';
import MarcheNouveau from './pages/MarcheNouveau';
import MarcheDetail from './pages/MarcheDetail';
import ChantierDetail from './pages/ChantierDetail';
import Placeholder from './pages/Placeholder';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('btp_user');
    if (savedUser) {
      try { 
        setUser(JSON.parse(savedUser)); 
      } catch(e) { 
        localStorage.removeItem('btp_user'); 
      }
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
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-gray-200 border-t-[#F97316] rounded-full mx-auto mb-4" />
          <p className="text-gray-500 text-sm font-medium">Chargement de BTP Manager...</p>
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

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <Sidebar isOpen={sidebarOpen} user={user} onLogout={handleLogout} />
      
      <div 
        className="flex-1 flex flex-col transition-all duration-300" 
        style={{ marginLeft: sidebarOpen ? '260px' : '60px' }}
      >
        <Header 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          user={user} 
          onActionClick={() => console.log('Action clicked')}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            
            <Route path="/appels-offres" element={<Placeholder title="Appels d'offres" />} />
            <Route path="/marches-publics" element={<MarchesPublics />} />
            <Route path="/marches-publics/nouveau" element={<MarcheNouveau />} />
            <Route path="/marches-publics/:id" element={<MarcheDetail />} />
            
            <Route path="/lots-chantiers" element={<Projets />} />
            <Route path="/lots-chantiers/:id" element={<Projets />} />
            
            <Route path="/mode-chantier" element={<ChantierMode />} />
            <Route path="/mode-chantier/:sub" element={<ChantierMode />} />
            
            <Route path="/documents" element={<Documents />} />
            <Route path="/approvisionnement" element={<Achats />} />
            <Route path="/approvisionnement/:id" element={<Achats />} />
            
            <Route path="/finance" element={<Finance />} />
            <Route path="/finance/:tab" element={<Finance />} />
            
            <Route path="/parametres" element={<Settings />} />
            <Route path="/parametres/:tab" element={<Settings />} />
            
            <Route path="/outils/calculs-metiers" element={<Placeholder title="Calculs Métiers" />} />
            <Route path="/outils/ia" element={<Placeholder title="Estimation IA" />} />
            <Route path="/outils/prix-marche" element={<Placeholder title="Prix du marché" />} />
            
            <Route path="*" element={
              <div className="py-20 text-center">
                <h2 className="text-2xl font-bold text-gray-700">404 — Page introuvable</h2>
                <p className="text-gray-500 mt-2">La page que vous recherchez n'existe pas ou a été déplacée.</p>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="mt-6 text-[#F97316] font-bold hover:underline"
                >
                  Retour au tableau de bord
                </button>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
