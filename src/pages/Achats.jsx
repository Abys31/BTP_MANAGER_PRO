import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Truck, 
  FileCheck, 
  Receipt, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight,
  MoreVertical,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../utils/api';

const formatDA = (v) => new Intl.NumberFormat('fr-DZ').format(v || 0) + ' DA';

export default function Achats() {
  const [tab, setTab] = useState('PIPELINE'); // PIPELINE, FOURNISSEURS, FACTURES
  const [bcs, setBcs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/bons-commande');
      if (res.success) setBcs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pipelineSteps = [
    { key: 'COMMANDE', label: 'Commande', icon: ShoppingCart },
    { key: 'LIVRAISON', label: 'Livraison', icon: Truck },
    { key: 'CONTROLE', label: 'Contrôle', icon: FileCheck },
    { key: 'FACTURE', label: 'Facture', icon: Receipt }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#111827]">Approvisionnement</h1>
          <p className="text-gray-500 font-medium">Pipeline des achats et logistique chantier</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white border border-gray-200 text-gray-600 px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm hover:bg-gray-50">
             Fournisseurs
           </button>
           <button className="bg-[#F97316] hover:bg-[#EA6C0A] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold transition-all shadow-sm">
             <Plus size={20} strokeWidth={3} />
             <span>Nouveau BC</span>
           </button>
        </div>
      </div>

      {/* Stats / Quick Filter */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F97316] flex items-center justify-center">
               <Clock size={20} />
            </div>
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">En attente</p>
               <h3 className="text-xl font-black text-gray-800">5 Commandes</h3>
            </div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
               <Truck size={20} />
            </div>
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">En transit</p>
               <h3 className="text-xl font-black text-gray-800">2 Livraisons</h3>
            </div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-[#10B981] flex items-center justify-center">
               <CheckCircle2 size={20} />
            </div>
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Terminées</p>
               <h3 className="text-xl font-black text-gray-800">12 Achats</h3>
            </div>
         </div>
         <div className="bg-[#1C2333] p-5 rounded-2xl shadow-sm text-white flex flex-col justify-center">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Budget Engagé</span>
            <h3 className="text-xl font-black">1.2M DA</h3>
         </div>
      </div>

      {/* Main Content: Pipeline Visualizer */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-black text-gray-800 uppercase tracking-tighter flex items-center gap-2 text-sm">
               <ShoppingCart size={18} className="text-[#F97316]" /> Pipeline des Bons de Commande (BC)
            </h3>
            <div className="flex items-center gap-2">
               <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="N° BC, Fournisseur..." className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#F97316]" />
               </div>
               <button className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600"><Filter size={16} /></button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-gray-50/50">
                     <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">N° BC</th>
                     <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Fournisseur</th>
                     <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Chantier / Lot</th>
                     <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Pipeline Étapes</th>
                     <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Montant TTC</th>
                     <th className="px-6 py-4 text-center"><MoreVertical size={14} className="mx-auto text-gray-300" /></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {loading ? (
                     <tr><td colSpan={6} className="py-20 text-center text-gray-400 italic">Chargement du pipeline...</td></tr>
                  ) : bcs.length === 0 ? (
                     <tr><td colSpan={6} className="py-20 text-center"><Package size={48} className="mx-auto text-gray-100 mb-4" /><p className="text-gray-400 font-bold uppercase text-xs">Aucune commande active</p></td></tr>
                  ) : bcs.map(bc => (
                     <tr key={bc.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
                        <td className="px-6 py-5">
                           <span className="text-xs font-black text-gray-800 font-mono">BC-{bc.id}</span>
                           <p className="text-[10px] text-gray-400 font-bold mt-0.5 uppercase">{new Date(bc.date_bc).toLocaleDateString('fr-DZ')}</p>
                        </td>
                        <td className="px-6 py-5">
                           <span className="text-xs font-black text-[#111827] uppercase">{bc.fournisseur?.nom || 'FOURNISSEUR X'}</span>
                        </td>
                        <td className="px-6 py-5">
                           <span className="text-xs font-bold text-gray-600 uppercase">{bc.chantier?.nom || 'STOCK CENTRAL'}</span>
                        </td>
                        <td className="px-6 py-5">
                           {/* Pipeline Visualizer in Table Cell */}
                           <div className="flex items-center justify-center gap-1">
                              {pipelineSteps.map((step, idx) => {
                                 // Simple logic for the demo: 0-1 COMPLETED, 2 IN_PROGRESS, 3 PENDING
                                 const status = idx < 2 ? 'COMPLETED' : idx === 2 ? 'IN_PROGRESS' : 'PENDING';
                                 return (
                                    <React.Fragment key={step.key}>
                                       <div 
                                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                                             status === 'COMPLETED' ? 'bg-[#10B981] text-white shadow-sm' :
                                             status === 'IN_PROGRESS' ? 'bg-[#F97316] text-white shadow-md scale-110' :
                                             'bg-gray-100 text-gray-300'
                                          }`}
                                          title={step.label}
                                       >
                                          <step.icon size={12} strokeWidth={3} />
                                       </div>
                                       {idx < pipelineSteps.length - 1 && (
                                          <div className={`h-0.5 w-4 rounded-full ${status === 'COMPLETED' ? 'bg-[#10B981]' : 'bg-gray-100'}`} />
                                       )}
                                    </React.Fragment>
                                 );
                              })}
                           </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                           <span className="text-xs font-black text-gray-800">{formatDA(bc.montant_ttc)}</span>
                        </td>
                        <td className="px-6 py-5 text-center">
                           <div className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-[#1C2333] group-hover:text-white transition-all">
                              <ChevronRight size={16} strokeWidth={3} />
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* Legend / Info bar */}
         <div className="bg-gray-50 px-6 py-3 flex items-center gap-6 text-[9px] font-black uppercase tracking-widest text-gray-400">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#10B981]" />Étape Validée</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#F97316]" />Étape en cours</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-100" />En attente</div>
            <div className="ml-auto text-orange-500 flex items-center gap-1 animate-pulse"><AlertCircle size={10} /> Livraison retardée sur BC-42</div>
         </div>
      </div>
    </div>
  );
}
