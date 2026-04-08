import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  ShieldCheck, 
  TrendingUp,
  Clock,
  Calendar,
  MoreVertical,
  ChevronRight,
  Landmark
} from 'lucide-react';
import { api } from '../utils/api';

const formatDA = (v) => {
  return new Intl.NumberFormat('fr-DZ').format(v || 0) + ' DA';
};

export default function MarchesPublics() {
  const [marches, setMarches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMarches();
  }, []);

  const fetchMarches = async () => {
    try {
      const data = await api.get('/marches');
      setMarches(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMarches = marches.filter(m => {
    const matchesSearch = (m.titre || '').toLowerCase().includes(search.toLowerCase()) || 
                          (m.numero_contrat || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || m.statut === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: 'Marchés Total', value: marches.length, icon: FileText, color: '#F97316' },
    { label: 'Marchés Actifs', value: marches.filter(m => m.statut === 'ACTIF').length, icon: ShieldCheck, color: '#10B981' },
    { label: 'Montant Total HT', value: formatDA(marches.reduce((acc, m) => acc + (m.montant_ht || 0), 0)), icon: TrendingUp, color: '#3B82F6' },
  ];

  const getStatusInfo = (status) => {
    switch (status) {
      case 'ACTIF': return { color: '#10B981', label: 'Actif', bg: '#D1FAE5' };
      case 'TERMINE': return { color: '#6B7280', label: 'Terminé', bg: '#F3F4F6' };
      case 'RESILIE': return { color: '#EF4444', label: 'Résilié', bg: '#FEE2E2' };
      default: return { color: '#F59E0B', label: 'En attente', bg: '#FEF3C7' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Marchés Publics</h1>
          <p className="text-gray-500 font-medium">Gestion et suivi des contrats et conventions</p>
        </div>
        <button 
          onClick={() => navigate('/marches-publics/nouveau')}
          className="bg-[#F97316] hover:bg-[#EA6C0A] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold transition-all shadow-sm"
        >
          <Plus size={20} strokeWidth={3} />
          <span>Nouveau Marché</span>
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}15`, color: s.color }}>
              <s.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
              <h3 className="text-xl font-black text-[#111827]">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Rechercher par numéro ou intitulé..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#F97316] focus:outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-48">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none focus:ring-2 focus:ring-[#F97316] focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="ACTIF">Actif</option>
              <option value="TERMINE">Terminé</option>
              <option value="RESILIE">Résilié</option>
            </select>
          </div>
          <button className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-100">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Grid of Market Cards */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin w-10 h-10 border-4 border-gray-200 border-t-[#F97316] rounded-full mx-auto mb-4" />
          <p className="text-gray-500 text-sm font-medium">Chargement des marchés...</p>
        </div>
      ) : filteredMarches.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-20 text-center">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-700">Aucun marché trouvé</h3>
          <p className="text-gray-500 text-sm mt-1">Commencez par créer votre premier marché public.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMarches.map((m) => {
            const status = getStatusInfo(m.statut);
            return (
              <div 
                key={m.id}
                onClick={() => navigate(`/marches-publics/${m.id}`)}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden group"
              >
                <div className="p-5 space-y-4">
                  {/* Card Header Tags */}
                  <div className="flex justify-between items-start">
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">
                      N° {m.numero_contrat}
                    </span>
                    <div 
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase"
                      style={{ backgroundColor: status.bg, color: status.color }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: status.color }} />
                      {status.label}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-black text-[#111827] uppercase leading-tight line-clamp-2 h-10 group-hover:text-[#F97316] transition-colors">
                    {m.titre}
                  </h3>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4 py-2">
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
                        <Calendar size={10} /> ODS
                      </p>
                      <p className="text-[11px] font-bold text-gray-700 italic">
                        {m.ods_demarrage ? new Date(m.ods_demarrage).toLocaleDateString('fr-DZ') : 'À définir'}
                      </p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1 justify-end">
                        <Clock size={10} /> Délai
                      </p>
                      <p className="text-[11px] font-bold text-gray-700 italic">
                        {m.delai_initial_jours ? `${m.delai_initial_jours} jours` : '---'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer bar */}
                <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex items-center justify-between group-hover:bg-[#FFF7ED] transition-colors">
                  <div className="flex items-center gap-2">
                    <Landmark size={14} className="text-gray-400" />
                    <span className="text-[11px] font-bold text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                      {m.maitre_ouvrage_nom || 'Client Public'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[#F97316] opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[11px] font-black uppercase tracking-tighter">Ouvrir</span>
                    <ChevronRight size={14} strokeWidth={3} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
