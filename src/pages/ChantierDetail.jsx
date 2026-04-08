import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  LayoutDashboard, 
  Network, 
  FileCheck, 
  CalendarRange, 
  ChevronRight,
  TrendingUp,
  Clock,
  HardHat,
  Landmark,
  MapPin,
  CheckCircle2,
  MoreVertical,
  Activity,
  Calculator,
  GanttChartSquare
} from 'lucide-react';
import { api } from '../utils/api';

const formatDA = (v) => new Intl.NumberFormat('fr-DZ').format(v || 0) + ' DA';

export default function ChantierDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chantier, setChantier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('SYNTHESE');

  useEffect(() => {
    fetchChantier();
  }, [id]);

  const fetchChantier = async () => {
    try {
      const res = await api.get(`/chantiers/${id}`);
      if (res.success) setChantier(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="py-20 text-center">
      <div className="animate-spin w-10 h-10 border-4 border-gray-200 border-t-[#F97316] rounded-full mx-auto mb-4" />
    </div>
  );

  if (!chantier) return (
    <div className="py-20 text-center">
      <h2 className="text-xl font-black text-gray-700">Lot non trouvé</h2>
      <button onClick={() => navigate('/lots-chantiers')} className="mt-4 text-[#F97316] font-black uppercase text-sm">Retour à la liste</button>
    </div>
  );

  const tabs = [
    { id: 'SYNTHESE', label: 'Synthèse', icon: LayoutDashboard },
    { id: 'WBS', label: 'WBS / Lots', icon: Network },
    { id: 'SITUATIONS', label: 'Situations', icon: FileCheck },
    { id: 'PLANNING', label: 'Planning', icon: CalendarRange },
  ];

  const workflow = [
    { id: 'PROJET', label: 'Projet', status: 'COMPLETED' },
    { id: 'MARCHE', label: 'Marché', status: 'COMPLETED' },
    { id: 'DQE', label: 'DQE', status: 'IN_PROGRESS' },
    { id: 'AVENANTS', label: 'Avenants', status: 'PENDING' },
    { id: 'SITUATIONS', label: 'Situations', status: 'PENDING' }
  ];

  return (
    <div className="space-y-6">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/lots-chantiers')}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              <span>Lot / Chantier</span>
              <span>/</span>
              <span className="text-gray-600">{chantier.code}</span>
            </div>
            <h1 className="text-2xl font-black text-[#111827] uppercase leading-tight max-w-2xl">
              {chantier.nom}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[#1C2333] text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold uppercase shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            Statut: {chantier.statut}
          </div>
          <button className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 shadow-sm transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* BTP Workflow Progress Bar */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
         <div className="flex items-center justify-between relative">
            {/* Background line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-50 -translate-y-1/2 -z-0" />
            
            {workflow.map((step, idx) => (
               <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 bg-white px-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                     step.status === 'COMPLETED' ? 'bg-[#10B981] border-[#10B981] text-white' :
                     step.status === 'IN_PROGRESS' ? 'bg-white border-[#F97316] text-[#F97316]' :
                     'bg-white border-gray-50 text-gray-200'
                  }`}>
                     {step.status === 'COMPLETED' ? <CheckCircle2 size={16} strokeWidth={3} /> : <span className="text-xs font-black">{idx + 1}</span>}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-tighter ${
                     step.status === 'COMPLETED' ? 'text-[#10B981]' :
                     step.status === 'IN_PROGRESS' ? 'text-[#F97316]' :
                     'text-gray-300'
                  }`}>
                     {step.label}
                  </span>
               </div>
            ))}
         </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
               <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                  <Calculator size={18} />
               </div>
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Montant Marché</span>
            </div>
            <h3 className="text-lg font-black text-gray-800">{formatDA(chantier.marche?.montant_ht)}</h3>
            <div className="mt-2 h-1 bg-gray-50 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: '45%' }} />
            </div>
         </div>

         <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
               <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#F97316] flex items-center justify-center">
                  <TrendingUp size={18} />
               </div>
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Réalisation Cumulée</span>
            </div>
            <h3 className="text-lg font-black text-gray-800">0.00 DA</h3>
            <span className="text-[10px] font-bold text-[#F97316] uppercase mt-1">Avancement: 0.0%</span>
         </div>

         <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
               <div className="w-9 h-9 rounded-lg bg-green-50 text-[#10B981] flex items-center justify-center">
                  <Activity size={18} />
               </div>
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reste à Réaliser</span>
            </div>
            <h3 className="text-lg font-black text-gray-800">{formatDA(chantier.marche?.montant_ht)}</h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase mt-1 italic">Délai: 100% restant</span>
         </div>

         <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
               <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Clock size={18} />
               </div>
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expiration</span>
            </div>
            <h3 className="text-lg font-black text-gray-800">Non défini</h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase mt-1">À compter de l'ODS</span>
         </div>
      </div>

      {/* Main Tab System */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        <div className="bg-gray-50/50 border-b border-gray-100">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-8 py-5 text-[11px] font-black uppercase tracking-widest transition-all relative border-b-2 ${
                  activeTab === tab.id 
                    ? 'border-[#F97316] text-[#F97316] bg-white' 
                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={15} strokeWidth={3} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8 flex-1">
           {activeTab === 'SYNTHESE' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-300">
                 <div className="md:col-span-2 space-y-8">
                    <div className="space-y-4">
                       <h4 className="font-black text-gray-800 uppercase tracking-tighter text-sm flex items-center gap-2">
                          <Info size={16} className="text-[#F97316]" /> Détails du Lot
                       </h4>
                       <div className="grid grid-cols-2 gap-x-12 gap-y-4 bg-gray-50/50 p-6 rounded-2xl">
                          <div className="flex flex-col gap-1">
                             <span className="text-[10px] font-black text-gray-400 uppercase">Marché Parent</span>
                             <span className="text-xs font-black text-[#F97316] hover:underline cursor-pointer flex items-center gap-1 uppercase">
                                {chantier.marche?.numero_contrat} <ChevronRight size={12} />
                             </span>
                          </div>
                          <div className="flex flex-col gap-1">
                             <span className="text-[10px] font-black text-gray-400 uppercase">Localisation</span>
                             <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                                <MapPin size={12} /> {chantier.wilaya || 'Alger'}
                             </span>
                          </div>
                          <div className="flex flex-col gap-1">
                             <span className="text-[10px] font-black text-gray-400 uppercase">Chef de Chantier</span>
                             <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                                <HardHat size={12} /> {chantier.responsable || 'Non assigné'}
                             </span>
                          </div>
                          <div className="flex flex-col gap-1">
                             <span className="text-[10px] font-black text-gray-400 uppercase">Maître d'Ouvrage</span>
                             <span className="text-xs font-bold text-gray-700 flex items-center gap-1 uppercase">
                                <Landmark size={12} /> {chantier.marche?.maitre_ouvrage_nom}
                             </span>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="font-black text-gray-800 uppercase tracking-tighter text-sm flex items-center gap-2">
                          <TrendingUp size={16} className="text-[#F97316]" /> Avancement par Phase
                       </h4>
                       <div className="space-y-5">
                          {[
                             { label: 'Terrassements', p: 100 },
                             { label: 'Gros Œuvres', p: 45 },
                             { label: 'Second Œuvre', p: 0 },
                             { label: 'VRD', p: 0 }
                          ].map(phase => (
                             <div key={phase.label} className="space-y-2">
                                <div className="flex justify-between text-[11px] font-bold">
                                   <span className="text-gray-600 uppercase">{phase.label}</span>
                                   <span className="text-[#F97316]">{phase.p}%</span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                   <div className={`h-full transition-all duration-1000 ${phase.p === 100 ? 'bg-[#10B981]' : 'bg-[#F97316]'}`} style={{ width: `${phase.p}%` }} />
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="bg-[#1C2333] rounded-2xl p-6 text-white space-y-6 flex flex-col">
                    <h4 className="font-black uppercase tracking-widest text-[10px] text-gray-400">Synthèse Financière (Lot)</h4>
                    <div className="space-y-6 flex-1">
                       <div className="flex justify-between items-end border-b border-white/5 pb-4">
                          <div>
                             <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Dépenses Cumulées</p>
                             <p className="text-xl font-black">{formatDA(0)}</p>
                          </div>
                          <TrendingUp className="text-green-500" size={24} />
                       </div>
                       <div className="flex justify-between items-end border-b border-white/5 pb-4">
                          <div>
                             <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Marge Prévisionnelle</p>
                             <p className="text-xl font-black text-[#F97316]">--- %</p>
                          </div>
                          <Calculator className="text-gray-500" size={24} />
                       </div>
                    </div>
                    <button className="w-full bg-[#3B82F6] hover:bg-blue-600 py-3 rounded-xl font-black uppercase text-[11px] tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 mt-auto">
                       Générer Rapport Flash <FileCheck size={16} />
                    </button>
                 </div>
              </div>
           )}

           {activeTab === 'WBS' && (
              <div className="py-20 text-center animate-in fade-in duration-300">
                 <Network size={64} className="mx-auto text-gray-100 mb-6" />
                 <h3 className="text-xl font-black text-gray-400 uppercase mb-2">Work Breakdown Structure</h3>
                 <p className="text-sm text-gray-400 max-w-sm mx-auto">
                    Définissez la hiérarchie des tâches et sous-lots. Importation possible depuis MS Project ou Primavera.
                 </p>
                 <div className="mt-8 flex justify-center gap-4">
                    <button className="bg-[#1C2333] text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl">
                       Charger WBS
                    </button>
                 </div>
              </div>
           )}

           {activeTab === 'SITUATIONS' && (
              <div className="py-20 text-center animate-in fade-in duration-300">
                 <div className="w-20 h-20 bg-orange-50 text-[#F97316] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calculator size={40} />
                 </div>
                 <h3 className="text-xl font-black text-gray-800 uppercase mb-2">Métrés & Travaux</h3>
                 <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                    Module de saisie des métrés pour la génération automatique de la situation de travaux n°01. 
                    Le système compare les quantités réalisées par rapport au DQE contractuel.
                 </p>
                 <div className="mt-8">
                    <button className="bg-[#F97316] text-white px-10 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-[#EA6C0A] transition-all">
                       Commencer la saisie
                    </button>
                 </div>
              </div>
           )}

           {activeTab === 'PLANNING' && (
              <div className="py-20 text-center animate-in fade-in duration-300">
                 <GanttChartSquare size={64} className="mx-auto text-gray-100 mb-6" />
                 <h3 className="text-xl font-black text-gray-400 uppercase mb-2">Gantt Interactive</h3>
                 <p className="text-sm text-gray-400">Le planning prévisionnel n'est pas encore initialisé pour ce lot.</p>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
