import React from 'react'
import { Search, Plus, Printer, Globe, Bell, Menu } from 'lucide-react'

const Header = ({ toggleSidebar }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Rechercher" />
        </div>
      </div>

      <div className="header-right">
        <button className="action-btn-primary">
          <Plus size={18} />
          <span>Actions</span>
        </button>
        
        <div className="icon-group">
          <button className="icon-btn"><Printer size={20} /></button>
          <button className="icon-btn"><Globe size={20} /></button>
          <button className="icon-btn relative">
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>
        </div>
      </div>

      <style jsx="true">{`
        .header {
          height: var(--header-height);
          background-color: var(--bg-main);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          position: sticky;
          top: 0;
          z-index: 90;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }

        .mobile-menu-btn {
          display: none;
          color: var(--text-secondary);
        }

        @media (max-width: 1024px) {
          .mobile-menu-btn { display: block; }
        }

        .search-bar {
          background-color: var(--bg-sidebar);
          border: 1px solid var(--border);
          border-radius: 8px;
          display: flex;
          align-items: center;
          padding: 8px 12px;
          gap: 10px;
          max-width: 400px;
          width: 100%;
        }

        .search-icon { color: var(--text-muted); }

        .search-bar input {
          background: none;
          border: none;
          color: var(--text-main);
          outline: none;
          width: 100%;
          font-size: 14px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .action-btn-primary {
          background-color: var(--primary);
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          font-size: 14px;
          transition: var(--transition);
        }

        .action-btn-primary:hover {
          background-color: var(--primary-hover);
          transform: translateY(-1px);
        }

        .icon-group {
          display: flex;
          align-items: center;
          gap: 8px;
          border-left: 1px solid var(--border);
          padding-left: 20px;
        }

        .icon-btn {
          color: var(--text-secondary);
          padding: 8px;
          border-radius: 8px;
          transition: var(--transition);
        }

        .icon-btn:hover {
          background-color: var(--bg-sidebar);
          color: var(--text-main);
        }

        .relative { position: relative; }

        .notification-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          background-color: var(--warning);
          border-radius: 50%;
          border: 2px solid var(--bg-main);
        }
      `}</style>
    </header>
  )
}

export default Header
