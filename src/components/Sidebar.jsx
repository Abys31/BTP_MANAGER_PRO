import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSearch,
  ShieldCheck,
  Building2,
  HardHat,
  FileText,
  Truck,
  DollarSign,
  Settings,
  Wrench,
  ChevronDown,
  ChevronRight,
  LogOut,
  User as UserIcon,
  BookOpen,
  Calculator,
  Sparkles,
  TrendingUp
} from 'lucide-react';

const Sidebar = ({ isOpen, user, onLogout }) => {
  const [toolsOpen, setToolsOpen] = useState(false);

  const navItems = [
    { name: 'Tableau de bord', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Appels d\'offres', path: '/appels-offres', icon: FileSearch },
    { name: 'Marchés Publics', path: '/marches-publics', icon: ShieldCheck },
    { name: 'Lots / Chantiers', path: '/lots-chantiers', icon: Building2 },
    { name: 'Mode Chantier', path: '/mode-chantier', icon: HardHat },
    { name: 'Documents', path: '/documents', icon: FileText },
    { name: 'Approvisionnement', path: '/approvisionnement', icon: Truck },
    { name: 'Finance', path: '/finance', icon: DollarSign },
    { name: 'Paramètres', path: '/parametres', icon: Settings },
  ];

  const toolItems = [
    { name: 'Calculs Métiers', path: '/outils/calculs-metiers', icon: Calculator },
    { name: 'Estimation IA', path: '/outils/ia', icon: Sparkles, badge: 'PRO' },
    { name: 'Prix du marché', path: '/outils/prix-marche', icon: TrendingUp },
  ];

  return (
    <aside
      className="fixed top-0 left-0 h-screen bg-[#1C2333] text-gray-400 transition-all duration-300 z-50 flex flex-col border-r border-gray-800"
      style={{ width: isOpen ? '260px' : '60px' }}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <div className="w-9 h-9 bg-[#F97316] rounded-lg flex items-center justify-center flex-shrink-0">
          <HardHat size={22} className="text-white" />
        </div>
        {isOpen && (
          <div className="overflow-hidden whitespace-nowrap">
            <h1 className="text-white font-bold text-sm leading-tight">BTP Manager DZ</h1>
            <p className="text-[10px] text-gray-500 font-medium">BTP Algérie</p>
          </div>
        )}
      </div>

      {/* Account Section */}
      {isOpen && (
        <div className="p-4 border-b border-gray-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300">
            {user?.nom?.[0] || 'D'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-300 truncate">
              {user?.nom || 'Compte Demo'}
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-700">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `sidebar-nav-item flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative ${
                isActive ? 'bg-[rgba(249,115,22,0.12)] text-[#F97316]' : 'hover:bg-[#252D3D] hover:text-gray-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#F97316] rounded-r-full" />}
                <item.icon size={20} className={isActive ? 'text-[#F97316]' : 'text-gray-400 group-hover:text-gray-200'} />
                {isOpen && <span className="text-[13.5px] font-medium truncate">{item.name}</span>}
              </>
            )}
          </NavLink>
        ))}

        {/* Tools Collapsible */}
        <div className="pt-2">
          <button
            onClick={() => setToolsOpen(!toolsOpen)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-[#252D3D] hover:text-gray-200 ${toolsOpen ? 'text-gray-200' : ''}`}
          >
            <Wrench size={20} className={toolsOpen ? 'text-gray-200' : 'text-gray-400'} />
            {isOpen && (
              <>
                <span className="text-[13.5px] font-medium flex-1 text-left">Outils</span>
                {toolsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </>
            )}
          </button>
          
          {toolsOpen && isOpen && (
            <div className="mt-1 ml-4 space-y-1 border-l border-gray-800">
              {toolItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-gray-400 hover:text-gray-200 ${
                      isActive ? 'text-[#F97316]' : ''
                    }`
                  }
                >
                  <item.icon size={16} />
                  <span className="text-xs font-medium truncate">{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto bg-[#F97316] text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* User Info & Footer */}
      <div className="mt-auto border-t border-gray-800 bg-[#161C2B]">
        <div className="p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#F97316] flex items-center justify-center text-white font-bold">
            {user?.nom?.[0] || 'N'}
          </div>
          {isOpen && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-bold text-white truncate">{user?.nom || 'nasser'}</p>
                <span className="bg-[#F97316] text-white text-[9px] font-bold px-1.5 py-0.5 rounded leading-none uppercase">DEMO</span>
              </div>
              <p className="text-[11px] text-gray-500 truncate">{user?.role === 'SUPER_ADMIN' ? 'Administrateur' : user?.role || 'Utilisateur'}</p>
            </div>
          )}
        </div>
        
        <div className="px-4 pb-4">
          <button 
            className="flex items-center gap-3 w-full p-2 text-gray-500 hover:text-white transition-colors border border-gray-800 rounded-lg"
            onClick={onLogout}
          >
            <BookOpen size={18} />
            {isOpen && <span className="text-[13px] font-medium">Guide de l'application</span>}
            {isOpen && <ChevronRight size={14} className="ml-auto" />}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
