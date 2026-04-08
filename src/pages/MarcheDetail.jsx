import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  Layers, 
  TrendingUp, 
  Clock, 
  Calendar,
  CreditCard,
  ShieldCheck,
  FileText,
  Plus,
  Info,
  CheckCircle2,
  AlertTriangle,
  History,
  Paperclip,
  GanttChartSquare,
  BadgeCent
} from 'lucide-react';
import { api } from '../utils/api';

const formatDA = (v) => new Intl.NumberFormat('fr-DZ').format(v || 0) + ' DA';

export default function MarcheDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [marche, setMarche] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('INFOS');

  useEffect(() => {
    fetchMarche();
  }, [id]);

  const fetchMarche = async () => {
    try {
      const res = await api.get(`/marches/${id}`);
      if (res.success) setMarche(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="py-20 text-center">
      <div className="animate-spin w-10 h-10 border-4 border-gray-200 border-t-[#F97316] rounded-full mx-auto mb-4" />
      <p className="text-gray-500 text-sm font-medium">Chargement du marché...</p>
    </div>
  );

  if (!marche) return (
    <div className="py-20 text-center">
      <h2 className="text-xl font-bold text-gray-700">Marché non trouvé</h2>
      <button onClick={() => navigate('/marches-publics')} className="mt-4 text-[#F97316] font-bold">Retour à la liste</button>
    </div>
  );

  const tabs = [
    { id: 'INFOS', label: 'Informations', icon: Info },
    { id: 'LOTS', label: 'Lots', icon: Layers },
    { id: 'DQE', label: 'DQE / BPU', icon: FileText },
    { id: 'PLANNING', label: 'Planning', icon: GanttChartSquare },
    { id: 'ODS', label: 'ODS', icon: Calendar },
    { id: 'REVISION', label: 'Révision Prix', icon: History },
    { id: 'AVENANTS', label: 'Avenants', icon: TrendingUp },
    { id: 'ATTACHEMENTS', label: 'Attachements', icon: Paperclip },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/marches-publics')}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              <span>Marchés Publics</span>
              <span>/</span>
              <span className="text-gray-600">N° {marche.numero_contrat}</span>
            </div>
            <h1 className="text-2xl font-black text-[#111827] uppercase leading-tight max-w-2xl">
              {marche.titre}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-green-100 text-[#10B981] px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold uppercase shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            {marche.statut}
          </div>
          <button className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 shadow-sm">
            <Edit3 size={18} />
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Montant DQE (HT)</p>
          <h3 className="text-xl font-black text-[#111827]">{formatDA(marche.montant_ht)}</h3>
          <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">Soit {formatDA(marche.montant_ttc)} TTC</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Avenants</p>
          <h3 className="text-xl font-black text-[#F97316]">+ 0.00 DA</h3>
          <p className="text-[10px] text-orange-400 font-bold mt-1 uppercase">0 validés</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Ajusté</p>
          <h3 className="text-xl font-black text-[#3B82F6]">{formatDA(marche.montant_ht)}</h3>
          <p className="text-[10px] text-blue-400 font-bold mt-1 uppercase">Base initial</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Délai Contractuel</p>
          <h3 className="text-xl font-black text-gray-700">{marche.delai_initial_jours || '---'} Jours</h3>
          <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">Fin: À définir</p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        <div className="bg-gray-50/50 border-b border-gray-100 px-2 overflow-x-auto">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-[11px] font-black uppercase tracking-widest transition-all relative border-b-2 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'border-[#F97316] text-[#F97316]' 
                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={14} strokeWidth={3} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-8">
          {activeTab === 'INFOS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Informations Client */}
              <div className="space-y-6 text-sm">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500">
                    <CheckCircle2 size={16} />
                  </div>
                  <h4 className="font-black text-gray-800 uppercase tracking-tighter">Maître d'Ouvrage</h4>
                </div>
                <div className="space-y-4 px-2">
                  <div className="flex justify-between items-center group cursor-default">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Client Principal</span>
                    <span className="font-black text-gray-800 text-right">{marche.maitre_ouvrage_nom}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Origine</span>
                    <span className="bg-[#1C2333] text-white px-2 py-0.5 rounded text-[10px] font-black">{marche.origine}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Régime fiscal</span>
                    <span className="font-black text-gray-800">TVA {marche.tva_taux}%</span>
                  </div>
                </div>
              </div>

              {/* Mode Management */}
              <div className="space-y-6 text-sm">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500">
                    <TrendingUp size={16} />
                  </div>
                  <h4 className="font-black text-gray-800 uppercase tracking-tighter">Config. Alerte Plus-values</h4>
                </div>
                <div className="p-5 bg-[#FFF7ED] rounded-xl border border-orange-100 flex gap-4">
                  <div className="w-10 h-10 bg-[#F97316] rounded-lg items-center justify-center flex flex-shrink-0 text-white shadow-sm">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h5 className="font-black text-[#F97316] uppercase text-xs mb-1">MODE SOUPLE (Actif)</h5>
                    <p className="text-[11px] text-orange-800 leading-relaxed font-medium">
                      Le système émet un avertissement visuel en cas de dépassement des quantités du DQE, 
                      mais autorise la validation si l'avenant est en cours de signature.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-end">
                   <button className="text-[10px] font-black text-gray-400 hover:text-[#F97316] flex items-center gap-1 transition-colors uppercase">
                     Passer en mode strict <BadgeCent size={12} />
                   </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'LOTS' && (
            <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-2xl animate-in fade-in duration-300">
              <Layers size={48} className="mx-auto text-gray-200 mb-4" />
              <h3 className="text-lg font-bold text-gray-400 uppercase">Structure des lots non définie</h3>
              <p className="text-xs text-gray-400 mt-2">Ce marché ne possède pas encore de découpage par lots.</p>
              <button className="mt-6 bg-[#1C2333] text-white px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2 mx-auto">
                <Plus size={16} /> Créer le lot n°01
              </button>
            </div>
          )}

          {activeTab === 'DQE' && (
            <div className="py-20 text-center animate-in fade-in duration-300">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto">
                   <FileText size={32} />
                </div>
                <h3 className="text-xl font-black text-[#111827]">DQE / BPU</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Importez ou saisissez la structure des prix unitaires. Le DQE servira de base pour le calcul automatique des attachements et des situations de travaux.
                </p>
                <div className="pt-4 flex items-center gap-3 justify-center">
                  <button className="bg-[#1C2333] text-white px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2 group transition-all hover:bg-black">
                     <Plus size={16} /> Ajouter une ligne
                  </button>
                  <button className="bg-white border border-gray-200 text-gray-600 px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all hover:bg-gray-50">
                     <span>Importer Excel</span>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {['PLANNING', 'ODS', 'REVISION', 'AVENANTS', 'ATTACHEMENTS'].includes(activeTab) && (
            <div className="py-20 text-center animate-in fade-in duration-300">
              <History size={48} className="mx-auto text-gray-200 mb-4" />
              <h3 className="text-lg font-bold text-gray-400 uppercase">Module {activeTab}</h3>
              <p className="text-xs text-gray-400 mt-2 italic">Données en cours de synchronisation...</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer sticky bar (optional) */}
      <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm text-xs text-gray-400">
        <div className="flex items-center gap-4">
           <span className="font-bold uppercase flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-300" /> Saisie: 16 janv. 2026</span>
           <span className="font-bold uppercase flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-300" /> Modifié: à l'instant</span>
        </div>
        <div className="flex items-center gap-4">
           <span className="text-[#F97316] font-black uppercase underline cursor-pointer">Logs système</span>
           <span className="text-gray-600 font-black uppercase">REF: M-{marche.id}</span>
        </div>
      </div>
    </div>
  );
}
