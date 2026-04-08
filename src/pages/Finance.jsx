import React, { useState } from 'react';
import { 
  BarChart3, 
  Receipt, 
  Wallet, 
  TrendingUp, 
  Users, 
  CreditCard, 
  PieChart, 
  ShieldCheck,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  DollarSign
} from 'lucide-react';

export default function Finance() {
  const [activeTab, setActiveTab] = useState('CONTRÔLE'); // Default to a summary tab or one of the 8

  const tabs = [
    { id: 'DEVIS', label: 'Devis & Offres', icon: FileText },
    { id: 'FACTURES', label: 'Factures Clients', icon: Receipt },
    { id: 'DEPENSES', label: 'Dépenses / Achats', icon: ArrowDownRight },
    { id: 'TRESORERIE', label: 'Trésorerie / Banques', icon: Wallet },
    { id: 'CLIENTS', label: 'Gestion Clients', icon: Users },
    { id: 'PAIE', label: 'Paie & RH', icon: CreditCard },
    { id: 'RAPPORTS', label: 'Rapports & Analytique', icon: BarChart3 },
    { id: 'CAUTIONS', label: 'Cautions Bancaires', icon: ShieldCheck },
  ];

  const stats = [
    { label: 'Chiffre d\'Affaires', value: '42.5M DA', trend: '+12.5%', color: '#3B82F6', icon: TrendingUp },
    { label: 'Dépenses Totales', value: '18.2M DA', trend: '+5.4%', color: '#EF4444', icon: ArrowDownRight },
    { label: 'Résultat Net', value: '24.3M DA', trend: 'Sain', color: '#10B981', icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#111827]">Finance & Gestion</h1>
          <p className="text-gray-500 font-medium">Pilotage financier et comptabilité analytique</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-[#1C2333] hover:bg-black text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold transition-all shadow-sm">
             <Plus size={20} strokeWidth={3} />
             <span>Nouvelle Transaction</span>
           </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-[#F97316] transition-all">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all" style={{ backgroundColor: `${s.color}15`, color: s.color }}>
                  <s.icon size={24} strokeWidth={3} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                  <h3 className="text-xl font-black text-[#111827]">{s.value}</h3>
               </div>
            </div>
            <div className={`text-[10px] font-black px-2 py-1 rounded-full ${
               s.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-500'
            }`}>
               {s.trend}
            </div>
          </div>
        ))}
      </div>

      {/* 8-Tab Navigation Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gray-50/50 border-b border-gray-100 px-2 overflow-x-auto no-scrollbar">
          <div className="flex whitespace-nowrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative border-b-2 ${
                  activeTab === tab.id 
                    ? 'border-[#F97316] text-[#F97316] bg-white' 
                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={14} strokeWidth={3} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Placeholder */}
        <div className="p-12 text-center animate-in fade-in duration-300">
           <div className="max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                 {tabs.find(t => t.id === activeTab)?.icon && React.createElement(tabs.find(t => t.id === activeTab).icon, { size: 40 })}
              </div>
              <div>
                 <h3 className="text-lg font-black text-gray-800 uppercase tracking-tighter">Module {tabs.find(t => t.id === activeTab)?.label}</h3>
                 <p className="text-xs text-gray-400 mt-2 font-medium leading-relaxed">
                    Accédez à la gestion détaillée de vos {tabs.find(t => t.id === activeTab)?.label.toLowerCase()}. 
                    Toutes les transactions sont synchronisées avec la trésorerie centrale.
                 </p>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3 justify-center">
                 <div className="relative w-full sm:w-64">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Rechercher..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#F97316]" />
                 </div>
                 <button className="bg-[#1C2333] text-white px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest shadow-md hover:bg-black transition-all">
                    Filtrer <Filter size={14} className="inline ml-2" />
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h4 className="font-black text-gray-800 uppercase tracking-tighter text-sm flex items-center gap-2">
               <BarChart3 size={18} className="text-[#F97316]" /> Évolution Mensuelle
            </h4>
            <div className="h-48 bg-gray-50 rounded-xl flex items-end justify-between p-6 gap-2">
               {[40, 60, 45, 90, 65, 80, 50].map((h, i) => (
                  <div key={i} className="flex-1 bg-blue-100 rounded-t-sm transition-all hover:bg-[#F97316]" style={{ height: `${h}%` }} />
               ))}
            </div>
            <div className="flex justify-between text-[10px] font-black text-gray-300 uppercase tracking-widest">
               <span>Jan</span><span>Fév</span><span>Mar</span><span>Avr</span><span>Mai</span><span>Juin</span><span>Juil</span>
            </div>
         </div>

         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h4 className="font-black text-gray-800 uppercase tracking-tighter text-sm flex items-center gap-2">
               <PieChart size={18} className="text-[#F97316]" /> Répartition des Dépenses
            </h4>
            <div className="flex items-center gap-8 py-4">
               <div className="w-32 h-32 rounded-full border-[12px] border-blue-500 border-r-orange-500 border-b-green-500" />
               <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold">
                     <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> Achats Matériaux</span>
                     <span className="text-gray-400">45%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold">
                     <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500" /> Main d'œuvre</span>
                     <span className="text-gray-400">35%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold">
                     <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /> Logistique</span>
                     <span className="text-gray-400">20%</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
