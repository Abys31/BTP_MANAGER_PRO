import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  ChevronRight, 
  Building2,
  CheckCircle2,
  Circle,
  LayoutGrid
} from 'lucide-react';
import { api } from '../utils/api';

const formatDA = (v) => new Intl.NumberFormat('fr-DZ').format(v || 0) + ' DA';

export default function Chantiers() {
  const [chantiers, setChantiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchChantiers();
  }, []);

  const fetchChantiers = async () => {
    try {
      const res = await api.get('/chantiers');
      if (res.success) setChantiers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = chantiers.filter(c => 
    (c.nom || '').toLowerCase().includes(search.toLowerCase()) || 
    (c.code || '').toLowerCase().includes(search.toLowerCase())
  );

  // Workflow steps for the BTP visualization
  const workflowSteps = [
    { key: 'PROJET', label: 'Projet' },
    { key: 'MARCHE', label: 'Marché' },
    { key: 'DQE', label: 'DQE' },
    { key: 'AVENANTS', label: 'Avenants' },
    { key: 'SITUATIONS', label: 'Situations' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#111827]">Lots & Chantiers</h1>
          <p className="text-gray-500 font-medium">Réalisation et suivi opérationnel</p>
        </div>
        <button className="bg-[#1C2333] hover:bg-black text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold transition-all shadow-sm">
          <Plus size={20} strokeWidth={3} />
          <span>Affecter un lot</span>
        </button>
      </div>

      {/* Search & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher un lot ou un chantier..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-[#F97316] outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
            <Filter size={20} />
          </button>
        </div>
        <div className="bg-[#1C2333] p-4 rounded-xl shadow-sm text-white flex flex-col justify-center">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">En cours</span>
          <h3 className="text-2xl font-black">{chantiers.filter(c => c.statut === 'EN_COURS').length} Lots</h3>
        </div>
      </div>

      {/* Grid of Chantiers */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin w-10 h-10 border-4 border-gray-200 border-t-[#F97316] rounded-full mx-auto mb-4" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-100 rounded-2xl p-20 text-center">
          <LayoutGrid size={48} className="mx-auto text-gray-200 mb-4" />
          <h3 className="text-lg font-bold text-gray-500">Aucun lot actif</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <div 
              key={c.id}
              onClick={() => navigate(`/lots-chantiers/${c.id}`)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full"
            >
              <div className="p-6 flex-1 space-y-4">
                <div className="flex justify-between items-start">
                   <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#F97316] shadow-inner">
                      <Building2 size={20} />
                   </div>
                   <span className="bg-gray-100 text-gray-500 text-[10px] font-black px-2 py-1 rounded">
                      ID-{c.id}
                   </span>
                </div>

                <div>
                   <h3 className="text-sm font-black text-[#111827] uppercase leading-snug h-10 line-clamp-2">
                      {c.nom}
                   </h3>
                   <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-bold mt-1">
                      <MapPin size={12} />
                      {c.wilaya || 'Alger'}
                   </div>
                </div>

                {/* Workflow Dots */}
                <div className="pt-2">
                   <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3">Workflow Status</p>
                   <div className="flex items-center gap-3">
                      {workflowSteps.map((step, idx) => {
                         const isActive = idx < 3; // Mock logic: Projet/Marché/DQE active
                         return (
                            <div key={step.key} className="flex flex-col items-center gap-1.5">
                               {isActive ? (
                                  <div className="w-3.5 h-3.5 bg-[#10B981] rounded-full flex items-center justify-center text-white shadow-sm">
                                     <CheckCircle2 size={8} strokeWidth={4} />
                                  </div>
                               ) : (
                                  <div className="w-3.5 h-3.5 border-2 border-gray-100 rounded-full bg-white" />
                               )}
                               <span className={`text-[8px] font-black uppercase tracking-tighter ${isActive ? 'text-[#10B981]' : 'text-gray-300'}`}>
                                  {step.label}
                               </span>
                            </div>
                         );
                      })}
                   </div>
                </div>
              </div>

              {/* Footer bar */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between rounded-b-2xl group-hover:bg-[#1C2333] transition-colors">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight group-hover:text-gray-500">Marché Parent</span>
                    <span className="text-[11px] font-bold text-gray-600 group-hover:text-white truncate max-w-[150px]">
                       {c.marche?.numero_contrat || 'Sans marché'}
                    </span>
                 </div>
                 <div className="p-2 bg-white rounded-lg text-[#F97316] group-hover:bg-[#F97316] group-hover:text-white transition-all shadow-sm">
                    <ChevronRight size={16} strokeWidth={3} />
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
