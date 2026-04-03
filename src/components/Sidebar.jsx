import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Building2, 
  FileText, 
  HardHat, 
  Files, 
  Truck, 
  Wallet, 
  Settings, 
  Wrench,
  User,
  ChevronDown,
  LogOut,
  BookOpen
} from 'lucide-react'

const Sidebar = ({ isOpen, toggle }) => {
  const menuItems = [
    { name: 'Tableau de bord', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Chantiers', path: '/chantiers', icon: <Building2 size={20} /> },
    { name: 'Marchés Publics', path: '/marches', icon: <FileText size={20} /> },
    { name: 'Mode Chantier', path: '/chantier', icon: <HardHat size={20} /> },
    { name: 'Documents', path: '/documents', icon: <Files size={20} /> },
    { name: 'Logistique', path: '/logistics', icon: <Truck size={20} /> },
    { name: 'Finance', path: '/finance', icon: <Wallet size={20} /> },
    { name: 'Paramètres', path: '/settings', icon: <Settings size={20} /> },
  ]

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">BTP</div>
          <div className="logo-text">
            <h3>BTP Manager DZ</h3>
            <span>BTP Algérie</span>
          </div>
        </div>
      </div>

      <div className="user-profile">
        <div className="avatar">
          <User size={24} />
        </div>
        <div className="user-info">
          <h4>Mmm</h4>
          <span className="role-badge">Administrateur</span>
        </div>
        <ChevronDown size={14} className="profile-arrow" />
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}

        <div className="nav-group">
          <button className="nav-item has-submenu">
            <Wrench size={20} />
            <span>Outils</span>
            <ChevronDown size={14} className="submenu-arrow" />
          </button>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="demo-badge">
          <div className="badge-content">
            <h4>Compte Demo Di...</h4>
            <span className="demo-tag">DEMO</span>
          </div>
          <span className="role-tag">Administrateur</span>
        </div>

        <div className="footer-links">
          <a href="#" className="footer-link">
            <BookOpen size={16} />
            <span>Guide de l'Application</span>
          </a>
          <button className="logout-btn">
            <LogOut size={16} />
          </button>
        </div>
      </div>

      <style jsx="true">{`
        .sidebar {
          width: var(--sidebar-width);
          background-color: var(--bg-sidebar);
          height: 100vh;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
          border-right: 1px solid var(--border);
          transition: var(--transition);
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid var(--border);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          background-color: var(--primary);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
        }

        .logo-text h3 {
          font-size: 16px;
          font-weight: 600;
        }

        .logo-text span {
          font-size: 12px;
          color: var(--text-muted);
        }

        .user-profile {
          margin: 20px;
          padding: 12px;
          background-color: var(--bg-card);
          border-radius: var(--border-radius);
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid var(--border);
        }

        .avatar {
          width: 36px;
          height: 36px;
          background-color: var(--bg-hover);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }

        .user-info h4 {
          font-size: 14px;
          font-weight: 500;
        }

        .role-badge {
          font-size: 10px;
          background-color: var(--primary-muted);
          color: var(--primary);
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .profile-arrow {
          margin-left: auto;
          color: var(--text-muted);
        }

        .sidebar-nav {
          flex: 1;
          padding: 10px 20px;
          overflow-y: auto;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          color: var(--text-secondary);
          border-radius: 8px;
          margin-bottom: 4px;
          transition: var(--transition);
        }

        .nav-item:hover {
          background-color: var(--bg-hover);
          color: var(--text-main);
        }

        .nav-item.active {
          background-color: var(--primary-muted);
          color: var(--primary);
          position: relative;
        }

        .nav-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background-color: var(--primary);
          border-radius: 0 4px 4px 0;
        }

        .submenu-arrow {
          margin-left: auto;
        }

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid var(--border);
        }

        .demo-badge {
          background-color: var(--bg-card);
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 1px solid var(--border);
        }

        .demo-tag {
          font-size: 9px;
          background-color: var(--warning);
          color: black;
          padding: 1px 4px;
          border-radius: 3px;
          font-weight: 700;
          margin-left: 8px;
        }

        .role-tag {
          display: block;
          margin-top: 4px;
          font-size: 11px;
          color: var(--text-muted);
        }

        .footer-links {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-link {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .logout-btn {
          color: var(--text-muted);
        }
      `}</style>
    </aside>
  )
}

export default Sidebar
