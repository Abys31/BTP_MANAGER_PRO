import React from 'react';
import { 
  Search, 
  Bell, 
  Printer, 
  Globe, 
  Plus, 
  Menu,
  ChevronDown,
  User
} from 'lucide-react';

const Header = ({ toggleSidebar, user, onActionClick }) => {
  return (
    <header className="h-[60px] bg-white border-b border-gray-200 sticky top-0 z-40 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={toggleSidebar}
          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 lg:hidden"
        >
          <Menu size={20} />
        </button>
        
        {/* Centered Search Bar */}
        <div className="hidden md:flex items-center flex-1 justify-center max-w-xl mx-auto">
          <div className="relative w-full">
            <Search 
              size={18} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
            />
            <input 
              type="text" 
              placeholder="Rechercher des marchés, chantiers ou documents..." 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:ring-opacity-20 focus:border-[#F97316] transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Action Button */}
        <button 
          onClick={onActionClick}
          className="bg-[#F97316] hover:bg-[#EA6C0A] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-sm transition-all"
        >
          <Plus size={18} />
          <span>Actions</span>
        </button>

        <div className="h-6 w-[1px] bg-gray-200 mx-2" />

        <div className="flex items-center gap-1">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Imprimer">
            <Printer size={18} />
          </button>
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Changer de langue">
            <Globe size={18} />
          </button>
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors relative" title="Notifications">
            <Bell size={18} />
            <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
          </button>
        </div>

        <div className="h-6 w-[1px] bg-gray-200 mx-2" />

        {/* User Dropdown Profile Placeholder */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200 group-hover:border-[#F97316] transition-colors">
            <User size={16} />
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-gray-800 leading-none mb-0.5">{user?.nom || 'Admin'}</p>
            <p className="text-[10px] text-gray-400 font-medium">{user?.email || 'admin@btp.dz'}</p>
          </div>
          <ChevronDown size={14} className="text-gray-400 group-hover:text-[#F97316]" />
        </div>
      </div>
    </header>
  );
};

export default Header;
