import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Plus,
  Bell,
  Menu,
  ChevronDown,
  Building2,
  Users,
  ShoppingCart,
  Settings,
  X
} from 'lucide-react';

const quickActions = [
  { label: 'Nouveau Projet', path: '/projets', icon: Building2 },
  { label: 'Nouvel Employé', path: '/rh', icon: Users },
  { label: 'Bon de Commande', path: '/achats', icon: ShoppingCart },
];

// Route title map
const routeTitles = {
  '/dashboard': { title: 'Tableau de bord', sub: 'Vue d\'ensemble de vos activités' },
  '/projets': { title: 'Projets & Chantiers', sub: 'Gestion de vos projets de construction' },
  '/achats': { title: 'Achats & Fournisseurs', sub: 'Commandes, livraisons et paiements' },
  '/stocks': { title: 'Stocks & Matériaux', sub: 'Inventaire et mouvements de stocks' },
  '/rh': { title: 'Ressources Humaines', sub: 'Employés, pointage et congés' },
  '/paie': { title: 'Paie & Bulletins', sub: 'Bulletins de paie et déclarations' },
  '/materiel': { title: 'Immobilisations', sub: 'Matériel, affectations et maintenances' },
  '/commercial': { title: 'Commercial Clients', sub: 'Lots, contrats et encaissements' },
  '/depenses': { title: 'Dépenses & Charges', sub: 'Dépenses directes et charges fixes' },
  '/finances': { title: 'Finances & Budget', sub: 'Suivi budgétaire et reporting' },
  '/settings': { title: 'Paramètres', sub: 'Configuration de l\'application' },
};

const Header = ({ toggleSidebar, user }) => {
  const [showActions, setShowActions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentRoute = routeTitles[location.pathname] || { title: 'BTP Manager DZ', sub: '' };

  const handleAction = (path) => {
    setShowActions(false);
    navigate(path);
  };

  return (
    <header className="app-header">
      {/* Left: Toggle + Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <Menu size={20} />
        </button>

        <div className="hidden md:block">
          <h1 className="text-base font-bold text-gray-800 leading-tight">{currentRoute.title}</h1>
          {currentRoute.sub && <p className="text-xs text-gray-500">{currentRoute.sub}</p>}
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden lg:flex flex-1 max-w-md mx-6">
        <div className="search-input-wrapper w-full">
          <Search size={15} className="search-icon-inner" />
          <input
            type="text"
            placeholder="Rechercher un projet, fournisseur, employé..."
            className="search-input"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Quick Create */}
        <div className="relative">
          <button
            className="btn btn-primary"
            onClick={() => setShowActions(!showActions)}
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Actions</span>
            <ChevronDown size={13} style={{ transform: showActions ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {showActions && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowActions(false)} />
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-1 animate-fade-in">
                {quickActions.map(({ label, path, icon: Icon }) => (
                  <button
                    key={path}
                    onClick={() => handleAction(path)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors font-medium"
                  >
                    <Icon size={15} className="text-gray-400" />
                    {label}
                  </button>
                ))}
                <div className="h-px bg-gray-100 mx-2 my-1" />
                <button
                  onClick={() => handleAction('/settings')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings size={15} className="text-gray-400" />
                  Paramètres
                </button>
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-fade-in overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <span className="font-semibold text-sm text-gray-800">Notifications</span>
                  <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={16} />
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {[
                    { icon: '⚠️', text: '3 articles sous seuil minimum', time: 'Il y a 5 min', type: 'warning' },
                    { icon: '💰', text: '2 factures fournisseurs échues', time: 'Il y a 1h', type: 'danger' },
                    { icon: '📅', text: 'Bulletin de paie mars non généré', time: 'Aujourd`hui', type: 'info' },
                  ].map((n, i) => (
                    <div key={i} className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-start gap-3">
                      <span className="text-lg">{n.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 font-medium">{n.text}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-gray-100 text-center">
                  <button className="text-sm font-medium text-orange-600 hover:underline">
                    Voir toutes les alertes
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="w-px h-6 bg-gray-200 hidden sm:block" />

        {/* User */}
        <div className="hidden sm:flex items-center gap-2 cursor-pointer">
          <div className="avatar w-8 h-8 text-xs font-bold" style={{ background: '#E07B2A', borderRadius: '8px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {user ? (user.prenom?.[0] || user.nom?.[0] || 'A') : 'A'}
          </div>
          <div className="hidden md:block text-right">
            <div className="text-xs font-semibold text-gray-800 leading-tight">
              {user ? `${user.prenom || ''} ${user.nom || ''}`.trim() || 'Admin' : 'Admin'}
            </div>
            <div className="text-xs text-gray-400">SARL CONSTRUCTIONS DZ</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
