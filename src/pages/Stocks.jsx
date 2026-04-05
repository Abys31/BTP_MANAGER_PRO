import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, AlertTriangle, X, Package, Activity, ClipboardList, BarChart3 } from 'lucide-react';
import { api } from '../utils/api';

const fmt = (v) => new Intl.NumberFormat('fr-DZ').format(Math.round(v || 0)) + ' DA';
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('fr-DZ') : '—';

const UNITE_OPTIONS = ['KG', 'TONNE', 'ML', 'M2', 'M3', 'PIECE', 'UNITE', 'SAC', 'LITRE', 'FORFAIT'];
const TYPE_MVT = ['ENTREE_ACHAT', 'ENTREE_RETOUR', 'SORTIE_CHANTIER', 'SORTIE_PERTE', 'TRANSFERT_SORTANT'];

// ─── CATALOGUE ───────────────────────────────────────────────────────────────
function OngletCatalogue() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const empty = { code: '', designation: '', categorie_id: '', unite: 'PIECE', prix_unitaire_moyen: 0, stock_minimum: 0, stock_maximum: null };
  const [form, setForm] = useState(empty);

  const load = useCallback(() => {
    api.get(`/articles?search=${search}`).then(r => r?.success && setArticles(r.data));
    api.get('/categories-articles').then(r => r?.success && setCategories(r.data));
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    const payload = { ...form, categorie_id: +form.categorie_id, prix_unitaire_moyen: +form.prix_unitaire_moyen, stock_minimum: +form.stock_minimum };
    if (editing) await api.put(`/articles/${editing.id}`, payload);
    else await api.post('/articles', payload);
    setShowModal(false); setEditing(null); setForm(empty); load();
  };

  const openEdit = (a) => { setEditing(a); setForm({ ...a, categorie_id: a.categorie_id }); setShowModal(true); };
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <>
      <div className="flex gap-3 mb-4">
        <div className="search-input-wrapper flex-1">
          <Search size={15} className="search-icon-inner" />
          <input className="search-input" placeholder="Rechercher un article..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setForm(empty); setShowModal(true); }}>
          <Plus size={15} /> Nouvel article
        </button>
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Code</th><th>Désignation</th><th>Catégorie</th><th>Unité</th><th>Stock actuel</th><th>Stock min</th><th>Prix moyen</th><th>Valeur stock</th><th>Alerte</th><th></th></tr></thead>
          <tbody>
            {articles.length === 0
              ? <tr><td colSpan={10} className="text-center py-8 text-muted">Aucun article</td></tr>
              : articles.map(a => {
                const sousMin = a.stock_actuel < a.stock_minimum;
                return (
                  <tr key={a.id} style={{ background: sousMin ? '#fffbeb' : undefined }}>
                    <td className="font-mono text-xs">{a.code}</td>
                    <td className="font-semibold">{a.designation}</td>
                    <td className="text-muted text-xs">{a.categorie?.nom}</td>
                    <td className="text-muted">{a.unite}</td>
                    <td className={`font-semibold ${sousMin ? 'text-danger' : ''}`}>{a.stock_actuel}</td>
                    <td className="text-muted">{a.stock_minimum}</td>
                    <td>{fmt(a.prix_unitaire_moyen)}</td>
                    <td className="font-semibold">{fmt(a.stock_actuel * a.prix_unitaire_moyen)}</td>
                    <td>{sousMin && <span className="badge badge-danger">⚠ Seuil</span>}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(a)}>✏️</button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-content" style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Modifier' : 'Nouvel'} article</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="form-label">Code *</label><input className="form-input" value={form.code} onChange={e => set('code', e.target.value)} /></div>
                <div>
                  <label className="form-label">Catégorie</label>
                  <select className="form-select" value={form.categorie_id} onChange={e => set('categorie_id', e.target.value)}>
                    <option value="">—</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                  </select>
                </div>
                <div className="col-span-2"><label className="form-label">Désignation *</label><input className="form-input" value={form.designation} onChange={e => set('designation', e.target.value)} /></div>
                <div>
                  <label className="form-label">Unité</label>
                  <select className="form-select" value={form.unite} onChange={e => set('unite', e.target.value)}>
                    {UNITE_OPTIONS.map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
                <div><label className="form-label">Prix moyen (DA)</label><input className="form-input" type="number" value={form.prix_unitaire_moyen} onChange={e => set('prix_unitaire_moyen', e.target.value)} /></div>
                <div><label className="form-label">Stock minimum</label><input className="form-input" type="number" value={form.stock_minimum} onChange={e => set('stock_minimum', e.target.value)} /></div>
                <div><label className="form-label">Stock maximum</label><input className="form-input" type="number" value={form.stock_maximum || ''} onChange={e => set('stock_maximum', e.target.value || null)} /></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={save}>{editing ? 'Enregistrer' : 'Créer'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── MOUVEMENTS ──────────────────────────────────────────────────────────────
function OngletMouvements() {
  const [data, setData] = useState([]);
  const [articles, setArticles] = useState([]);
  const [chantiers, setChantiers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ article_id: '', type_mouvement: 'SORTIE_CHANTIER', quantite: 1, prix_unitaire: 0, chantier_id: '', notes: '', reference_document: '' });

  const load = () => {
    api.get('/mouvements-stock').then(r => r?.success && setData(r.data));
    api.get('/articles').then(r => r?.success && setArticles(r.data));
    api.get('/chantiers').then(r => r?.success && setChantiers(r.data));
  };
  useEffect(load, []);

  const save = async () => {
    const art = articles.find(a => a.id === +form.article_id);
    await api.post('/mouvements-stock', { ...form, article_id: +form.article_id, quantite: +form.quantite, prix_unitaire: +form.prix_unitaire || art?.prix_unitaire_moyen || 0, chantier_id: form.chantier_id ? +form.chantier_id : undefined });
    setShowModal(false); load();
  };

  const isEntree = (t) => t?.startsWith('ENTREE') || t === 'INVENTAIRE_POSITIF';

  return (
    <>
      <div className="flex justify-end mb-4">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={15} /> Saisir mouvement</button>
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Date</th><th>Article</th><th>Type</th><th>Quantité</th><th>Prix unit.</th><th>Valeur</th><th>Chantier</th><th>Réf.</th></tr></thead>
          <tbody>
            {data.length === 0
              ? <tr><td colSpan={8} className="text-center py-8 text-muted">Aucun mouvement</td></tr>
              : data.map(m => (
                <tr key={m.id}>
                  <td className="text-xs text-muted">{fmtDate(m.date_mouvement)}</td>
                  <td className="font-semibold text-sm">{m.article?.designation}</td>
                  <td><span className={`badge ${isEntree(m.type_mouvement) ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: 10 }}>{m.type_mouvement.replace(/_/g, ' ')}</span></td>
                  <td className={`font-semibold ${isEntree(m.type_mouvement) ? 'text-success' : 'text-orange'}`}>{isEntree(m.type_mouvement) ? '+' : '-'}{m.quantite}</td>
                  <td className="text-muted text-xs">{fmt(m.prix_unitaire)}</td>
                  <td>{fmt(m.valeur_totale)}</td>
                  <td className="text-muted text-xs">{m.chantier?.nom || '—'}</td>
                  <td className="font-mono text-xs text-muted">{m.reference_document || '—'}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-content" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <span className="modal-title">Saisir un mouvement de stock</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="space-y-3">
                <div>
                  <label className="form-label">Article *</label>
                  <select className="form-select" value={form.article_id} onChange={e => setForm(f => ({ ...f, article_id: e.target.value }))}>
                    <option value="">— Sélectionner —</option>
                    {articles.map(a => <option key={a.id} value={a.id}>{a.designation} (stock: {a.stock_actuel} {a.unite})</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Type de mouvement *</label>
                  <select className="form-select" value={form.type_mouvement} onChange={e => setForm(f => ({ ...f, type_mouvement: e.target.value }))}>
                    {TYPE_MVT.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                {(form.type_mouvement?.startsWith('SORTIE') || form.type_mouvement?.startsWith('TRANSFERT')) && (
                  <div>
                    <label className="form-label">Chantier destination *</label>
                    <select className="form-select" value={form.chantier_id} onChange={e => setForm(f => ({ ...f, chantier_id: e.target.value }))}>
                      <option value="">—</option>
                      {chantiers.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                    </select>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="form-label">Quantité *</label><input className="form-input" type="number" value={form.quantite} onChange={e => setForm(f => ({ ...f, quantite: e.target.value }))} /></div>
                  <div><label className="form-label">Prix unitaire</label><input className="form-input" type="number" value={form.prix_unitaire} onChange={e => setForm(f => ({ ...f, prix_unitaire: e.target.value }))} /></div>
                </div>
                <div><label className="form-label">Notes</label><input className="form-input" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={save}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── ALERTES STOCK ────────────────────────────────────────────────────────────
function OngletAlertes() {
  const [alertes, setAlertes] = useState([]);
  useEffect(() => { api.get('/articles/alertes').then(r => r?.success && setAlertes(r.data)); }, []);
  return (
    <div>
      {alertes.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="empty-state-icon mx-auto mb-3">✅</div>
          <p className="text-success font-semibold">Aucune alerte — Tous les stocks sont au-dessus des seuils minimums</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {alertes.map(a => {
            const ecart = a.stock_minimum - a.stock_actuel;
            return (
              <div key={a.id} className="card p-4 border-l-4" style={{ borderLeftColor: '#ef4444' }}>
                <div className="flex items-start gap-3">
                  <AlertTriangle size={18} style={{ color: '#ef4444', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{a.designation}</p>
                    <p className="text-xs text-muted mt-1">{a.categorie?.nom}</p>
                    <div className="mt-2 space-y-1 text-xs">
                      <div className="flex justify-between"><span className="text-muted">Stock actuel</span><span className="font-semibold text-danger">{a.stock_actuel} {a.unite}</span></div>
                      <div className="flex justify-between"><span className="text-muted">Seuil minimum</span><span>{a.stock_minimum} {a.unite}</span></div>
                      <div className="flex justify-between"><span className="text-muted">Manque</span><span className="font-bold text-danger">{ecart} {a.unite}</span></div>
                      <div className="flex justify-between"><span className="text-muted">Valeur manquante</span><span>{fmt(ecart * a.prix_unitaire_moyen)}</span></div>
                    </div>
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

// ─── PAGE STOCKS ──────────────────────────────────────────────────────────────
const TABS = [
  { id: 'catalogue', label: 'Catalogue articles', icon: Package },
  { id: 'mouvements', label: 'Mouvements', icon: Activity },
  { id: 'alertes', label: 'Alertes stock', icon: AlertTriangle },
];

export default function Stocks() {
  const [tab, setTab] = useState('catalogue');
  return (
    <div className="p-6 md:p-8 animate-slide-up">
      <div className="page-header">
        <div><h1 className="page-title">Stocks & Matériaux</h1><p className="page-subtitle">Catalogue, mouvements et alertes de stock</p></div>
      </div>
      <div className="tabs-container">
        {TABS.map(t => (
          <button key={t.id} className={`tab-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>
      {tab === 'catalogue' && <OngletCatalogue />}
      {tab === 'mouvements' && <OngletMouvements />}
      {tab === 'alertes' && <OngletAlertes />}
    </div>
  );
}
