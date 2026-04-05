import React, { useState } from 'react';
import {
  Plus, Search, Filter, Download, Building2, HardHat,
  MapPin, Calendar, DollarSign, ChevronRight, Edit2,
  Trash2, Eye, MoreVertical, X, Loader2, ArrowLeft,
  CheckCircle, Clock, AlertCircle, XCircle, TrendingUp, Users
} from 'lucide-react';

// --- FORMATTERS ---
const formatDZD = (v) => new Intl.NumberFormat('fr-DZ').format(v) + ' DA';
const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-DZ') : '—';

// --- MOCK DATA ---
const PROJETS_MOCK = [
  {
    id: 1, code: 'PRJ-2024-001', nom: 'Résidence El Bahia — 100 Logements', type_projet: 'PROMOTION_IMMOBILIERE',
    statut: 'EN_COURS', wilaya: 'Oran', budget_total: 500000000, date_debut: '2024-01-10',
    date_fin_prevue: '2025-12-30', avancement: 55, chantiers_count: 3,
    description: 'Programme de 100 logements promotionnels à Oran, résidence fermée avec aménagements.'
  },
  {
    id: 2, code: 'PRJ-2024-002', nom: 'Lycée 1000 places — Aïn Bénian', type_projet: 'BATIMENT',
    statut: 'EN_COURS', wilaya: 'Alger', budget_total: 350000000, date_debut: '2024-03-15',
    date_fin_prevue: '2025-06-30', avancement: 32, chantiers_count: 2,
    description: 'Construction d\'un lycée d\'enseignement général, capacité 1000 élèves.'
  },
  {
    id: 3, code: 'PRJ-2025-001', nom: 'Lotissement El Wiam — 250 Lots', type_projet: 'LOTISSEMENT',
    statut: 'ETUDE', wilaya: 'Constantine', budget_total: 180000000, date_debut: '2025-05-01',
    date_fin_prevue: '2027-04-30', avancement: 5, chantiers_count: 1,
    description: 'Viabilisation et lotissement de 250 lots résidentiels à Constantine.'
  },
];

const CHANTIERS_MOCK = [
  { id: 1, project_id: 1, code: 'CHT-2024-01', nom: 'Gros Œuvres — Bâtiment A', statut: 'EN_COURS', avancement: 68, budget_alloue: 120000000, date_debut: '2024-02-01', date_fin_prevue: '2024-10-30' },
  { id: 2, project_id: 1, code: 'CHT-2024-02', nom: 'Second Œuvre — Bâtiment B', statut: 'EN_COURS', avancement: 45, budget_alloue: 90000000, date_debut: '2024-06-01', date_fin_prevue: '2025-03-30' },
  { id: 3, project_id: 2, code: 'CHT-2024-03', nom: 'Terrassement & Fondations', statut: 'EN_COURS', avancement: 89, budget_alloue: 50000000, date_debut: '2024-04-01', date_fin_prevue: '2024-07-30' },
  { id: 4, project_id: 2, code: 'CHT-2024-04', nom: 'Structure Béton', statut: 'EN_COURS', avancement: 32, budget_alloue: 130000000, date_debut: '2024-07-15', date_fin_prevue: '2025-02-28' },
];

const TYPE_LABELS = {
  LOTISSEMENT: 'Lotissement', PROMOTION_IMMOBILIERE: 'Promotion Imm.', TRAVAUX_PUBLICS: 'TP',
  BATIMENT: 'Bâtiment', RENOVATION: 'Rénovation',
};
const TYPE_COLORS = {
  LOTISSEMENT: 'badge-info', PROMOTION_IMMOBILIERE: 'badge-orange', TRAVAUX_PUBLICS: 'badge-gray',
  BATIMENT: 'badge-success', RENOVATION: 'badge-warning',
};
const STATUT_CONFIG = {
  EN_COURS: { label: 'En cours', color: 'badge-success', icon: CheckCircle },
  ETUDE: { label: 'En étude', color: 'badge-info', icon: Clock },
  SUSPENDU: { label: 'Suspendu', color: 'badge-warning', icon: AlertCircle },
  TERMINE: { label: 'Terminé', color: 'badge-gray', icon: CheckCircle },
  ANNULE: { label: 'Annulé', color: 'badge-danger', icon: XCircle },
};

// Modal de création rapide
const CreateProjectModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({
    code: '', nom: '', type_projet: 'BATIMENT', statut: 'ETUDE',
    wilaya: 'Alger', budget_total: '', date_debut: '', date_fin_prevue: '', description: ''
  });
  const wilayas = ['Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar','Blida','Bouira','Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Alger','Djelfa','Jijel','Sétif','Saïda','Skikda','Sidi Bel Abbès','Annaba','Guelma','Constantine','Médéa','Mostaganem','M\'Sila','Mascara','Ouargla','Oran','El Bayadh','Illizi','Bordj Bou Arréridj','Boumerdes','El Tarf','Tindouf','Tissemsilt','El Oued','Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma','Aïn Témouchent','Ghardaïa','Relizane','Timimoun','Bordj Badji Mokhtar','Ouled Djellal','Béni Abbès','In Salah','In Guezzam','Touggourt','Djanet','El M\'Ghair','El Meniaa'];

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth: 620 }}>
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#fff7ed' }}>
              <Building2 size={18} style={{ color: '#E07B2A' }} />
            </div>
            <span className="modal-title">Nouveau Projet</span>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm"><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Code projet *</label>
              <input className="form-input" placeholder="PRJ-2025-001" value={form.code} onChange={e => set('code', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Type de projet *</label>
              <select className="form-select" value={form.type_projet} onChange={e => set('type_projet', e.target.value)}>
                {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="form-label">Nom du projet *</label>
              <input className="form-input" placeholder="Ex: Résidence El Wiam — 80 logements" value={form.nom} onChange={e => set('nom', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Wilaya *</label>
              <select className="form-select" value={form.wilaya} onChange={e => set('wilaya', e.target.value)}>
                {wilayas.map(w => <option key={w}>{w}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Budget total (DA) *</label>
              <input className="form-input" type="number" placeholder="Ex: 250000000" value={form.budget_total} onChange={e => set('budget_total', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Date début *</label>
              <input className="form-input" type="date" value={form.date_debut} onChange={e => set('date_debut', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Date fin prévue</label>
              <input className="form-input" type="date" value={form.date_fin_prevue} onChange={e => set('date_fin_prevue', e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows={3} placeholder="Description du projet..." value={form.description} onChange={e => set('description', e.target.value)} style={{ resize: 'vertical' }} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={() => { onCreate(form); onClose(); }}>
            <Plus size={15} /> Créer le projet
          </button>
        </div>
      </div>
    </div>
  );
};

// Project detail view
const ProjetDetail = ({ projet, chantiers, onBack }) => {
  const [tab, setTab] = useState('info');
  const [avancement, setAvancement] = useState(projet.avancement);
  const sc = STATUT_CONFIG[projet.statut] || STATUT_CONFIG.ETUDE;

  return (
    <div className="p-6 md:p-8 animate-slide-up">
      {/* Breadcrumb */}
      <div className="breadcrumb mb-4">
        <button onClick={onBack} className="flex items-center gap-1 hover:text-orange-500 transition-colors">
          <ArrowLeft size={13} /> Projets
        </button>
        <span className="breadcrumb-sep">/</span>
        <span className="current">{projet.code}</span>
      </div>

      {/* Header Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#fff7ed' }}>
            <TrendingUp size={18} style={{ color: '#E07B2A' }} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Budget total</p>
            <p className="font-bold text-gray-800 text-sm">{formatDZD(projet.budget_total)}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#d1fae5' }}>
            <CheckCircle size={18} style={{ color: '#10b981' }} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Avancement</p>
            <p className="font-bold text-gray-800 text-sm">{avancement}%</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#dbeafe' }}>
            <HardHat size={18} style={{ color: '#3b82f6' }} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Chantiers</p>
            <p className="font-bold text-gray-800 text-sm">{chantiers.length} actifs</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#fef3c7' }}>
            <Calendar size={18} style={{ color: '#f59e0b' }} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Fin prévue</p>
            <p className="font-bold text-gray-800 text-sm">{formatDate(projet.date_fin_prevue)}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        {[
          { id: 'info', label: 'Informations', count: null },
          { id: 'chantiers', label: 'Chantiers', count: chantiers.length },
          { id: 'budget', label: 'Budget', count: null },
          { id: 'docs', label: 'Documents', count: 0 },
        ].map(t => (
          <button key={t.id} className={`tab-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
            {t.count !== null && <span className="tab-count">{t.count}</span>}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'info' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Building2 size={16} style={{ color: '#E07B2A' }} /> Informations générales
            </h3>
            <div className="space-y-3">
              {[
                ['Code', projet.code], ['Nom', projet.nom], ['Type', TYPE_LABELS[projet.type_projet]],
                ['Wilaya', projet.wilaya], ['Date début', formatDate(projet.date_debut)],
                ['Date fin prévue', formatDate(projet.date_fin_prevue)],
              ].map(([k, v]) => (
                <div key={k} className="flex items-start">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-32 flex-shrink-0 pt-0.5">{k}</span>
                  <span className="text-sm text-gray-700 font-medium">{v}</span>
                </div>
              ))}
              <div className="flex items-start">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-32 flex-shrink-0 pt-0.5">Statut</span>
                <span className={`badge ${STATUT_CONFIG[projet.statut]?.color}`}>{STATUT_CONFIG[projet.statut]?.label}</span>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold text-gray-700 mb-4">Avancement physique</h3>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-gray-600">Progression globale</span>
              <span className="font-bold" style={{ color: '#E07B2A' }}>{avancement}%</span>
            </div>
            <div className="progress-bar-track mb-4" style={{ height: 10 }}>
              <div className="progress-bar-fill" style={{ width: `${avancement}%` }} />
            </div>
            <input type="range" min="0" max="100" value={avancement} onChange={e => setAvancement(Number(e.target.value))}
              className="w-full mb-2" style={{ accentColor: '#E07B2A' }} />
            <p className="text-xs text-gray-400">Faites glisser le curseur pour mettre à jour l'avancement</p>
            {projet.description && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Description</p>
                <p className="text-sm text-gray-600">{projet.description}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'chantiers' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{chantiers.length} chantier(s) pour ce projet</p>
            <button className="btn btn-primary btn-sm"><Plus size={14} /> Nouveau chantier</button>
          </div>
          <div className="space-y-3">
            {chantiers.map(c => {
              const sc2 = STATUT_CONFIG[c.statut] || STATUT_CONFIG.EN_COURS;
              return (
                <div key={c.id} className="card p-5 card-hover">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#fff7ed' }}>
                        <HardHat size={18} style={{ color: '#E07B2A' }} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{c.nom}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{c.code} • {formatDate(c.date_debut)} → {formatDate(c.date_fin_prevue)}</p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-500">Avancement</span>
                            <span className="font-bold" style={{ color: '#E07B2A' }}>{c.avancement}%</span>
                          </div>
                          <div className="progress-bar-track" style={{ width: 200 }}>
                            <div className="progress-bar-fill" style={{ width: `${c.avancement}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <span className={`badge ${sc2.color} mb-2`}>{sc2.label}</span>
                      <p className="text-xs text-gray-500 mt-1">Budget</p>
                      <p className="text-sm font-bold text-gray-800">{formatDZD(c.budget_alloue)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            {chantiers.length === 0 && (
              <div className="card p-12 text-center">
                <div className="empty-state-icon mx-auto mb-3"><HardHat size={28} /></div>
                <p className="text-sm text-gray-500">Aucun chantier pour ce projet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'budget' && (
        <div className="card p-6">
          <p className="text-center text-gray-400 text-sm py-8">Module budget en cours de développement.</p>
        </div>
      )}
      {tab === 'docs' && (
        <div className="card p-6">
          <p className="text-center text-gray-400 text-sm py-8">Aucun document joint. Cliquez pour uploader.</p>
        </div>
      )}
    </div>
  );
};

// Main Projets Component
export default function Projets() {
  const [projets, setProjets] = useState(PROJETS_MOCK);
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [selectedProjet, setSelectedProjet] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const filtered = projets.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !search || p.nom.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.wilaya.toLowerCase().includes(q);
    const matchStatut = !filterStatut || p.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  const handleCreate = (data) => {
    const newP = { ...data, id: Date.now(), avancement: 0, chantiers_count: 0 };
    setProjets(p => [newP, ...p]);
  };

  const handleDelete = (id) => {
    if (window.confirm('Supprimer ce projet ?')) setProjets(p => p.filter(x => x.id !== id));
  };

  const chantiersForProjet = (pid) => CHANTIERS_MOCK.filter(c => c.project_id === pid);

  if (selectedProjet) {
    return (
      <ProjetDetail
        projet={selectedProjet}
        chantiers={chantiersForProjet(selectedProjet.id)}
        onBack={() => setSelectedProjet(null)}
      />
    );
  }

  return (
    <div className="p-6 md:p-8 animate-slide-up">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Projets & Chantiers</h1>
          <p className="page-subtitle">{projets.length} projet(s) enregistré(s)</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary btn-sm">
            <Download size={14} /> Exporter
          </button>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={16} /> Nouveau projet
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="search-input-wrapper flex-1">
          <Search size={15} className="search-icon-inner" />
          <input
            type="text"
            placeholder="Rechercher par nom, code, wilaya..."
            className="search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-select"
          style={{ width: 'auto', minWidth: 150 }}
          value={filterStatut}
          onChange={e => setFilterStatut(e.target.value)}
        >
          <option value="">Tous les statuts</option>
          {Object.entries(STATUT_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select className="form-select" style={{ width: 'auto', minWidth: 150 }}>
          <option>Tous les types</option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        {Object.entries(STATUT_CONFIG).slice(0, 4).map(([k, v]) => {
          const count = projets.filter(p => p.statut === k).length;
          return (
            <div key={k} className="card p-4 flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterStatut(filterStatut === k ? '' : k)}>
              <span className={`badge ${v.color} text-xs`}>{v.label}</span>
              <span className="font-bold text-gray-800">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Projets Grid */}
      {filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="empty-state">
            <div className="empty-state-icon mx-auto mb-4"><Building2 size={30} /></div>
            <h3>Aucun projet trouvé</h3>
            <p>Modifiez vos filtres ou créez un nouveau projet.</p>
            <button className="btn btn-primary mt-4" onClick={() => setShowCreate(true)}>
              <Plus size={15} /> Créer un projet
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(p => {
            const sc = STATUT_CONFIG[p.statut] || STATUT_CONFIG.ETUDE;
            return (
              <div key={p.id} className="card card-hover overflow-hidden flex flex-col">
                {/* Card top color bar */}
                <div style={{ height: 4, background: p.statut === 'EN_COURS' ? '#10b981' : p.statut === 'ETUDE' ? '#3b82f6' : '#94a3b8' }} />

                <div className="p-5 flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#fff7ed' }}>
                        <Building2 size={18} style={{ color: '#E07B2A' }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-mono text-gray-400">{p.code}</p>
                        <p className="font-semibold text-gray-800 text-sm leading-snug truncate">{p.nom}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={e => { e.stopPropagation(); setActiveMenu(activeMenu === p.id ? null : p.id); }}
                      >
                        <MoreVertical size={16} />
                      </button>
                      {activeMenu === p.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />
                          <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-1">
                            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 rounded-lg" onClick={() => { setActiveMenu(null); setSelectedProjet(p); }}>
                              <Eye size={14} style={{ color: '#E07B2A' }} /> Voir le détail
                            </button>
                            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setActiveMenu(null)}>
                              <Edit2 size={14} className="text-gray-400" /> Modifier
                            </button>
                            <div className="h-px bg-gray-100 my-1" />
                            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg" onClick={() => { setActiveMenu(null); handleDelete(p.id); }}>
                              <Trash2 size={14} /> Supprimer
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`badge ${sc.color}`}>{sc.label}</span>
                    <span className={`badge ${TYPE_COLORS[p.type_projet] || 'badge-gray'}`}>{TYPE_LABELS[p.type_projet]}</span>
                  </div>

                  {/* Info rows */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin size={12} /> {p.wilaya}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <DollarSign size={12} /> Budget : <span className="font-semibold text-gray-700">{formatDZD(p.budget_total)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={12} /> {formatDate(p.date_debut)} → {formatDate(p.date_fin_prevue)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <HardHat size={12} /> {p.chantiers_count} chantier(s)
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-500">Avancement</span>
                      <span className="font-bold" style={{ color: '#E07B2A' }}>{p.avancement}%</span>
                    </div>
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{ width: `${p.avancement}%` }} />
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between" style={{ background: '#f8fafc' }}>
                  <span className="text-xs text-gray-400">{p.code}</span>
                  <button
                    className="flex items-center gap-1 text-xs font-semibold transition-colors"
                    style={{ color: '#E07B2A' }}
                    onClick={() => setSelectedProjet(p)}
                  >
                    Voir détail <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Create */}
      {showCreate && <CreateProjectModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
    </div>
  );
}
