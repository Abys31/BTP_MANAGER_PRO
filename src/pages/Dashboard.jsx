import React from 'react';
import { 
  List, 
  AlertTriangle, 
  Wallet, 
  PiggyBank, 
  ChevronRight,
  Bell,
  Plus,
  ArrowRight,
  EyeOff,
  TrendingUp,
  MoreVertical
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

// --- FORMATTERS ---
const formatDA = (v) => {
  if (!v || v === 0) return '0 DA';
  const abs = Math.abs(v);
  const sign = v < 0 ? '-' : '';
  if (abs >= 1_000_000_000) return `${sign}${(abs/1_000_000_000).toFixed(1)}G DA`;
  if (abs >= 1_000_000) return `${sign}${(abs/1_000_000).toFixed(1)}M DA`;
  if (abs >= 1_000) return `${sign}${(abs/1_000).toFixed(0)}K DA`;
  return `${sign}${new Intl.NumberFormat('fr-DZ').format(abs)} DA`;
};

// --- MOCK DATA ---
const topChantiers = [
  { id: 1, nom: 'Résidence El Bahia — Bloc A', avancement: 68 },
  { id: 2, nom: 'Lycée 1000 places — Aïn Bénian', avancement: 45 },
  { id: 3, nom: 'Route Wilaya RW-14 — Tlemcen', avancement: 12 },
  { id: 4, nom: 'Promotion Immobilière Zeralda', avancement: 89 },
  { id: 5, nom: 'Aménagement Urbain Sidi Abdallah', avancement: 0 },
];

const projetsRecents = [
  { id: 101, nom: 'Rénovation Siège Social ABC', avancement: 75, statut: 'actif', color: '#10B981' },
  { id: 102, nom: 'Extension Hôpital Blida', avancement: 30, statut: 'pause', color: '#F97316' },
  { id: 103, nom: 'Gros Œuvre Parking Hydra', avancement: 55, statut: 'actif', color: '#10B981' },
  { id: 104, nom: 'Peinture Bâtiment C1', avancement: 95, statut: 'actif', color: '#10B981' },
  { id: 105, nom: 'Excavation Terrain Tipaza', avancement: 15, statut: 'probleme', color: '#EF4444' },
];

const alertesList = [
  { id: 1, msg: 'Matériel en maintenance : Grue G12', type: 'warning' },
  { id: 2, msg: 'Factures impayées : 3 clients (45.6M DA)', type: 'warning' },
  { id: 3, msg: 'Solde bas : Caisse Chantiers Oran', type: 'warning' },
];

// --- COMPONENTS ---
const KPICard = ({ label, value, sub, icon: Icon, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="w-11 h-11 bg-[#FFF7ED] rounded-lg flex items-center justify-center text-[#F97316]">
        <Icon size={24} />
      </div>
      <ChevronRight size={18} className="text-gray-300 group-hover:text-[#F97316] transition-colors" />
    </div>
    <div>
      <h3 className="text-2xl font-bold text-[#111827]">{value}</h3>
      <p className="text-sm font-medium text-gray-500 mt-1">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-2">{sub}</p>}
    </div>
  </div>
);

const ProgressBar = ({ value }) => {
  const getBadgeColor = (v) => {
    if (v === 0) return 'bg-[#FEE2E2] text-[#EF4444]';
    if (v === 100) return 'bg-[#D1FAE5] text-[#10B981]';
    return 'bg-[#FFF7ED] text-[#F97316]';
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#F97316] transition-all duration-500" 
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[32px] text-center ${getBadgeColor(value)}`}>
        {value}%
      </span>
    </div>
  );
};

export default function Dashboard({ user }) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[#111827]">Tableau de bord</h1>
          <p className="text-gray-500 font-medium">Bienvenue, {user?.nom || 'Nasser'} 👋</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2.5 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <button className="bg-[#F97316] hover:bg-[#EA6C0A] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold transition-all shadow-sm">
            <Plus size={20} strokeWidth={3} />
            <span>Nouveau chantier</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          label="Chantiers actifs" 
          value="16" 
          sub="32 Total" 
          icon={List} 
          onClick={() => console.log('goto /lots-chantiers')}
        />
        <KPICard 
          label="Alertes" 
          value="3" 
          sub="Aucune alerte critique" 
          icon={AlertTriangle} 
          onClick={() => console.log('goto alertes')}
        />
        <KPICard 
          label="Dépenses du mois" 
          value="2.1M DA" 
          sub="↑ 12% vs mois dernier" 
          icon={Wallet} 
          onClick={() => console.log('goto /finance')}
        />
        <KPICard 
          label="Solde trésorerie" 
          value="914.0M DA" 
          sub="↗ Positif" 
          icon={PiggyBank} 
          onClick={() => console.log('goto /finance')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column - Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Avancement Global Section */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                  📊 Avancement global
                </h3>
                <p className="text-sm text-gray-500">Progression des 5 chantiers principaux</p>
              </div>
              <button className="text-sm font-bold text-[#F97316] hover:underline flex items-center gap-1">
                Voir tout <ArrowRight size={14} />
              </button>
            </div>
            
            <div className="space-y-5">
              {topChantiers.map((c) => (
                <div key={c.id}>
                  <p className="text-sm font-semibold text-gray-700 mb-2 truncate">{c.nom}</p>
                  <ProgressBar value={c.avancement} />
                </div>
              ))}
            </div>
          </div>

          {/* Projets Récents Section */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                  📋 Projets récents
                </h3>
              </div>
              <button className="text-sm font-bold text-[#F97316] hover:underline flex items-center gap-1">
                Voir tout <ArrowRight size={14} />
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {projetsRecents.map((p) => (
                <div key={p.id} className="p-4 hover:bg-gray-50 flex items-center gap-4 group">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{p.nom}</p>
                  </div>
                  <div className="w-48 hidden sm:block">
                    <ProgressBar value={p.avancement} />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-5 bg-green-100 rounded-full relative cursor-pointer hidden sm:block">
                      <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Column - Alerts */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-[#111827] mb-6 flex items-center gap-2">
              ⚠️ Alertes ({alertesList.length})
            </h3>
            <div className="space-y-4">
              {alertesList.map((a) => (
                <div key={a.id} className="bg-[#FFF7ED] p-4 rounded-xl border border-orange-100 flex items-start gap-3 relative group">
                  <AlertTriangle className="text-[#F97316] flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-xs font-semibold text-gray-700 leading-relaxed pr-6">
                    {a.msg}
                  </p>
                  <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <EyeOff size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Grid Placeholder */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#DBEAFE] p-4 rounded-xl">
              <p className="text-[10px] font-bold text-[#1E40AF] uppercase tracking-wider mb-1">Missions</p>
              <p className="text-xl font-black text-[#1E40AF]">12</p>
            </div>
            <div className="bg-[#D1FAE5] p-4 rounded-xl">
              <p className="text-[10px] font-bold text-[#065F46] uppercase tracking-wider mb-1">Validées</p>
              <p className="text-xl font-black text-[#065F46]">45</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
