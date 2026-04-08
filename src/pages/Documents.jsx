import React, { useState } from 'react';
import { 
  Printer, 
  FileText, 
  Search, 
  Filter, 
  ChevronRight, 
  LayoutGrid, 
  Files, 
  Users, 
  CreditCard,
  Building2,
  HardHat,
  Download,
  Eye,
  MoreVertical
} from 'lucide-react';

export default function Documents() {
  const [activeCategory, setActiveCategory] = useState('ALL');

  const categories = [
    { id: 'MARCHES', label: 'Documents Marchés', icon: Building2, count: 5 },
    { id: 'SITUATIONS', label: 'Situations & Attachements', icon: FileText, count: 12 },
    { id: 'APPRO', label: 'BC / BL / Factures', icon: CreditCard, count: 48 },
    { id: 'RH', label: 'RH & Paie', icon: Users, count: 24 }
  ];

  const documents = [
    { id: 1, title: 'Marché N° 124/2026 - École Primaire', category: 'MARCHES', date: '16/01/2026', type: 'PDF', status: 'SIGNÉ' },
    { id: 2, title: 'Situation N° 05 - Gros Œuvres B1', category: 'SITUATIONS', date: '28/01/2026', type: 'PDF', status: 'VALIDÉ' },
    { id: 3, title: 'Bon de Commande BC-42 - Ciment', category: 'APPRO', date: '02/02/2026', type: 'PDF', status: 'ENVOYÉ' },
    { id: 4, title: 'Journal de Paie - Janvier 2026', category: 'RH', date: '01/02/2026', type: 'XLSX', status: 'FINALISÉ' },
  ];

  const filteredDocs = activeCategory === 'ALL' 
    ? documents 
    : documents.filter(d => d.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#111827]">Centre d'Impression</h1>
          <p className="text-gray-500 font-medium">Gérez et exportez vos documents administratifs</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-[#1C2333] hover:bg-black text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold transition-all shadow-sm">
             <Printer size={18} strokeWidth={3} />
             <span>Impression groupée</span>
           </button>
        </div>
      </div>

      {/* Categories Toolbar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {categories.map((cat) => (
            <button 
               key={cat.id}
               onClick={() => setActiveCategory(cat.id === activeCategory ? 'ALL' : cat.id)}
               className={`p-5 rounded-2xl border transition-all text-left flex flex-col gap-4 group ${
                  activeCategory === cat.id 
                     ? 'bg-[#1C2333] border-[#1C2333] text-white shadow-lg' 
                     : 'bg-white border-gray-100 text-gray-500 hover:border-[#F97316] hover:bg-[#FFF7ED]'
               }`}
            >
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  activeCategory === cat.id 
                     ? 'bg-white/10 text-white' 
                     : 'bg-gray-50 text-gray-400 group-hover:text-[#F97316] group-hover:bg-white'
               }`}>
                  <cat.icon size={20} />
               </div>
               <div>
                  <h4 className={`text-[10px] font-black uppercase tracking-widest ${activeCategory === cat.id ? 'text-gray-400' : 'text-gray-300'}`}>Groupe Documentaire</h4>
                  <p className="text-sm font-black uppercase tracking-tighter leading-tight mt-1">{cat.label}</p>
                  <p className={`text-[10px] font-bold mt-2 ${activeCategory === cat.id ? 'text-blue-400' : 'text-[#F97316]'}`}>{cat.count} Fichiers</p>
               </div>
            </button>
         ))}
      </div>

      {/* Document List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
         <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <h3 className="font-black text-gray-800 uppercase tracking-tighter flex items-center gap-2 text-sm">
                  <Files size={18} className="text-[#F97316]" /> Liste des Documents Générés
               </h3>
               <span className="bg-gray-100 text-gray-400 text-[10px] font-black px-2 py-0.5 rounded">PDF / ÉTAT OFFICIEUX</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Rechercher..." className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#F97316]" />
               </div>
               <button className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600"><Filter size={16} /></button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-gray-50/50">
                     <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Type</th>
                     <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Désignation du document</th>
                     <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date de Génération</th>
                     <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Statut</th>
                     <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {filteredDocs.length === 0 ? (
                     <tr><td colSpan={5} className="py-20 text-center"><LayoutGrid size={48} className="mx-auto text-gray-100 mb-4" /><p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Aucun document dans cette catégorie</p></td></tr>
                  ) : filteredDocs.map(doc => (
                     <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
                        <td className="px-6 py-5 text-center">
                           <div className={`w-8 h-8 rounded-lg mx-auto flex items-center justify-center text-[9px] font-black ${
                              doc.type === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'
                           } shadow-inner`}>
                              {doc.type}
                           </div>
                        </td>
                        <td className="px-6 py-5">
                           <span className="text-xs font-black text-gray-800 uppercase tracking-tight leading-tight">{doc.title}</span>
                           <div className="flex items-center gap-2 mt-1">
                              <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">REF: DOC-{doc.id}</span>
                              <div className="w-1 h-1 rounded-full bg-gray-200" />
                              <span className="text-[9px] font-bold text-gray-400 uppercase">{doc.category}</span>
                           </div>
                        </td>
                        <td className="px-6 py-5">
                           <span className="text-xs font-bold text-gray-500">{doc.date}</span>
                        </td>
                        <td className="px-6 py-5 text-center">
                           <span className="bg-gray-100 text-gray-500 text-[9px] font-black px-2 py-0.5 rounded tracking-widest">
                              {doc.status}
                           </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <button className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:bg-[#1C2333] hover:text-white transition-all shadow-sm" title="Consulter">
                                 <Eye size={14} />
                              </button>
                              <button className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:bg-[#F97316] hover:text-white transition-all shadow-sm" title="Télécharger">
                                 <Download size={14} />
                              </button>
                              <button className="p-2 text-gray-300 hover:text-gray-600">
                                 <MoreVertical size={14} />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* Legend / Info bar */}
         <div className="bg-gray-50 px-6 py-3 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-gray-300">
            <span>Copyright 2026 © BTP Manager DZ — Système G.E.D Intégré</span>
            <span className="text-gray-400">Total: {filteredDocs.length} Documents affichés</span>
         </div>
      </div>
    </div>
  );
}
