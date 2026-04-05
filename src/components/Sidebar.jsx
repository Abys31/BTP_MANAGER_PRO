import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  ShoppingCart,
  Package,
  Users,
  Car,
  Briefcase,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  User,
  ChevronDown,
  HardHat,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

const navGroups = [
  {
    label: 'PRINCIPAL',
    items: [
      { name: 'Tableau de bord', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Projets & Chantiers', path: '/projets', icon: Building2 },
    ]
  },
  {
    label: 'OPÉRATIONS',
    items: [
      { name: 'Achats & Fournisseurs', path: '/achats', icon: ShoppingCart },
      { name: 'Stocks & Matériaux', path: '/stocks', icon: Package },
      { name: 'Ressources Humaines', path: '/rh', icon: Users },
      { name: 'Paie & Bulletins', path: '/paie', icon: CreditCard },
      { name: 'Immobilisations', path: '/materiel', icon: Car },
    ]
  },
  {
    label: 'COMMERCIAL',
    items: [
      { name: 'Commercial Clients', path: '/commercial', icon: Briefcase },
      { name: 'Dépenses & Charges', path: '/depenses', icon: TrendingUp },
    ]
  },
  {
    label: 'PILOTAGE',
    items: [
      { name: 'Finances & Budget', path: '/finances', icon: BarChart3 },
    ]
  },
  {
    label: 'SYSTÈME',
    items: [
      { name: 'Paramètres', path: '/settings', icon: Settings },
    ]
  }
];

const Sidebar = ({ isOpen, user, onLogout }) => {
  return (
    <aside
      className="sidebar-dark flex flex-col fixed top-0 left-0 h-screen z-50 transition-all duration-300"
      style={{ width: isOpen ? '240px' : '72px' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: '#2e3447' }}>
        <div className="sidebar-logo-bg w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
          <HardHat size={20} color="white" />
        </div>
        {isOpen && (
          <div>
            <div className="font-bold text-sm text-white leading-tight">Atlas Manager</div>
            <div className="text-xs" style={{ color: '#64748b' }}>Gestion BTP • Algérie</div>
          </div>
        )}
      </div>

      {/* User Card */}
      {isOpen ? (
        <div className="sidebar-user-card flex items-center gap-3 cursor-pointer m-3">
          <div className="avatar w-9 h-9 text-white flex-shrink-0" style={{ background: '#E07B2A', fontSize: '14px', fontWeight: 700, borderRadius: '10px' }}>
            {user ? (user.prenom?.[0] || user.nom?.[0] || 'A') : 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">{user ? `${user.prenom || ''} ${user.nom || ''}`.trim() || 'Administrateur' : 'Administrateur'}</div>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(224,123,42,0.2)', color: '#E07B2A' }}>
              {user?.role || 'ADMIN'}
            </span>
          </div>
          <ChevronDown size={14} style={{ color: '#64748b' }} />
        </div>
      ) : (
        <div className="flex justify-center py-3 mx-2">
          <div className="avatar w-10 h-10" style={{ background: '#E07B2A', borderRadius: '10px', fontSize: '14px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {user ? (user.prenom?.[0] || 'A') : 'A'}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5" style={{ scrollbarWidth: 'thin', scrollbarColor: '#2e3447 transparent' }}>
        {navGroups.map((group) => (
          <div key={group.label} className="mb-1">
            {isOpen && <div className="sidebar-section-label">{group.label}</div>}
            {!isOpen && <div style={{ height: '8px' }} />}
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `sidebar-nav-item relative my-0.5 ${isActive ? 'active' : ''}`}
                  title={!isOpen ? item.name : undefined}
                >
                  <span className="nav-indicator" />
                  <Icon size={18} className="flex-shrink-0" />
                  {isOpen && <span className="truncate">{item.name}</span>}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t" style={{ borderColor: '#2e3447', background: 'rgba(0,0,0,0.15)' }}>
        <button
          onClick={onLogout}
          className="sidebar-nav-item w-full"
          title={!isOpen ? 'Déconnexion' : undefined}
          style={{ color: '#ef4444' }}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {isOpen && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
