import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit2, Trash2, X, ShoppingCart, Truck, FileText, Receipt, ChevronRight } from 'lucide-react';
import { api } from '../utils/api';

const fmt = (v) => new Intl.NumberFormat('fr-DZ').format(Math.round(v || 0)) + ' DA';
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('fr-DZ') : '—';

const STATUT_BC = { BROUILLON: 'badge-gray', ENVOYE: 'badge-info', PARTIELLEMENT_LIVRE: 'badge-warning', LIVRE: 'badge-success', ANNULE: 'badge-danger' };
const STATUT_FAC = { EN_ATTENTE: 'badge-warning', PARTIELLEMENT_PAYE: 'badge-info', PAYE: 'badge-success', LITIGE: 'badge-danger' };

// ─── ONGLET FOURNISSEURS ─────────────────────────────────────────────────────
function OngletFournisseurs() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const empty = { raison_sociale: '', rc: '', nif: '', telephone: '', email: '', wilaya: 'Alger', adresse: '', rib: '', banque: '', notes: '' };
  const [form, setForm] = useState(empty);

  const load = useCallback(async () => {
    const r = await api.get(`/fournisseurs?search=${search}`);
    if (r?.success) setData(r.data);
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (editing) await api.put(`/fournisseurs/${editing.id}`, form);
    else await api.post('/fournisseurs', form);
    setShowModal(false); setEditing(null); setForm(empty); load();
  };

  const remove = async (id) => {
    if (!confirm('Supprimer ?')) return;
    await api.delete(`/fournisseurs/${id}`); load();
  };

  const openEdit = (f) => { setEditing(f); setForm(f); setShowModal(true); };
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <>
      <div className="flex gap-3 mb-4">
        <div className="search-input-wrapper flex-1">
          <Search size={15} className="search-icon-inner" />
          <input className="search-input" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setForm(empty); setShowModal(true); }}>
          <Plus size={15} /> Nouveau fournisseur
        </button>
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Raison sociale</th><th>RC</th><th>Téléphone</th><th>Wilaya</th><th>Solde dû</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>
            {data.length === 0
              ? <tr><td colSpan={7} className="text-center py-8 text-muted">Aucun fournisseur</td></tr>
              : data.map(f => (
                <tr key={f.id}>
                  <td className="font-semibold">{f.raison_sociale}</td>
                  <td className="text-muted">{f.rc || '—'}</td>
                  <td>{f.telephone || '—'}</td>
                  <td>{f.wilaya || '—'}</td>
                  <td className={f.solde_courant > 0 ? 'text-danger font-semibold' : 'text-muted'}>{fmt(f.solde_courant)}</td>
                  <td><span className={`badge ${f.actif ? 'badge-success' : 'badge-danger'}`}>{f.actif ? 'Actif' : 'Inactif'}</span></td>
                  <td><div className="flex gap-2">
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(f)}><Edit2 size={13} /></button>
                    <button className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }} onClick={() => remove(f.id)}><Trash2 size={13} /></button>
                  </div></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-content" style={{ maxWidth: 580 }}>
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Modifier' : 'Nouveau'} fournisseur</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="form-label">Raison sociale *</label><input className="form-input" value={form.raison_sociale} onChange={e => set('raison_sociale', e.target.value)} /></div>
                <div><label className="form-label">N° RC</label><input className="form-input" value={form.rc || ''} onChange={e => set('rc', e.target.value)} /></div>
                <div><label className="form-label">NIF</label><input className="form-input" value={form.nif || ''} onChange={e => set('nif', e.target.value)} /></div>
                <div><label className="form-label">Téléphone</label><input className="form-input" value={form.telephone || ''} onChange={e => set('telephone', e.target.value)} /></div>
                <div><label className="form-label">Email</label><input className="form-input" type="email" value={form.email || ''} onChange={e => set('email', e.target.value)} /></div>
                <div><label className="form-label">Wilaya</label><input className="form-input" value={form.wilaya || ''} onChange={e => set('wilaya', e.target.value)} /></div>
                <div><label className="form-label">Banque</label><input className="form-input" value={form.banque || ''} onChange={e => set('banque', e.target.value)} /></div>
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

// ─── ONGLET BONS DE COMMANDE ─────────────────────────────────────────────────
function OngletBC() {
  const [data, setData] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [chantiers, setChantiers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ fournisseur_id: '', chantier_id: '', numero_bc: `BC-${Date.now()}`, date_bc: new Date().toISOString().split('T')[0], tva_taux: 19, notes: '' });
  const [lignes, setLignes] = useState([]);

  useEffect(() => {
    api.get('/bons-commande').then(r => r?.success && setData(r.data));
    api.get('/fournisseurs').then(r => r?.success && setFournisseurs(r.data));
    api.get('/chantiers').then(r => r?.success && setChantiers(r.data));
    api.get('/articles').then(r => r?.success && setArticles(r.data));
  }, []);

  const addLigne = () => setLignes(l => [...l, { article_id: '', designation: '', unite: '', quantite_commandee: 1, prix_unitaire_ht: 0, montant_ht: 0 }]);
  const updLigne = (i, k, v) => {
    setLignes(l => l.map((line, idx) => {
      if (idx !== i) return line;
      const updated = { ...line, [k]: v };
      if (k === 'article_id') {
        const art = articles.find(a => a.id === +v);
        if (art) { updated.designation = art.designation; updated.unite = art.unite; updated.prix_unitaire_ht = art.prix_unitaire_moyen; }
      }
      if (k === 'quantite_commandee' || k === 'prix_unitaire_ht') {
        updated.montant_ht = (k === 'quantite_commandee' ? +v : updated.quantite_commandee) * (k === 'prix_unitaire_ht' ? +v : updated.prix_unitaire_ht);
      }
      return updated;
    }));
  };
  const totalHT = lignes.reduce((s, l) => s + +l.montant_ht, 0);
  const totalTTC = totalHT * (1 + (form.tva_taux || 0) / 100);

  const save = async () => {
    await api.post('/bons-commande', { ...form, fournisseur_id: +form.fournisseur_id, chantier_id: +form.chantier_id, montant_ht: totalHT, montant_ttc: totalTTC, statut: 'BROUILLON', lignes });
    setShowModal(false); api.get('/bons-commande').then(r => r?.success && setData(r.data));
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={15} /> Nouveau BC</button>
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>N° BC</th><th>Date</th><th>Fournisseur</th><th>Chantier</th><th>Montant HT</th><th>TTC</th><th>Statut</th></tr></thead>
          <tbody>
            {data.length === 0
              ? <tr><td colSpan={7} className="text-center py-8 text-muted">Aucun bon de commande</td></tr>
              : data.map(bc => (
                <tr key={bc.id}>
                  <td className="font-mono font-semibold text-sm">{bc.numero_bc}</td>
                  <td>{fmtDate(bc.date_bc)}</td>
                  <td>{bc.fournisseur?.raison_sociale}</td>
                  <td>{bc.chantier?.nom}</td>
                  <td>{fmt(bc.montant_ht)}</td>
                  <td className="font-semibold">{fmt(bc.montant_ttc)}</td>
                  <td><span className={`badge ${STATUT_BC[bc.statut] || 'badge-gray'}`}>{bc.statut}</span></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-content" style={{ maxWidth: 860 }}>
            <div className="modal-header">
              <span className="modal-title">Nouveau bon de commande</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><label className="form-label">N° BC *</label><input className="form-input" value={form.numero_bc} onChange={e => setForm(f => ({ ...f, numero_bc: e.target.value }))} /></div>
                <div><label className="form-label">Date *</label><input className="form-input" type="date" value={form.date_bc} onChange={e => setForm(f => ({ ...f, date_bc: e.target.value }))} /></div>
                <div>
                  <label className="form-label">Fournisseur *</label>
                  <select className="form-select" value={form.fournisseur_id} onChange={e => setForm(f => ({ ...f, fournisseur_id: e.target.value }))}>
                    <option value="">— Sélectionner —</option>
                    {fournisseurs.map(f => <option key={f.id} value={f.id}>{f.raison_sociale}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Chantier *</label>
                  <select className="form-select" value={form.chantier_id} onChange={e => setForm(f => ({ ...f, chantier_id: e.target.value }))}>
                    <option value="">— Sélectionner —</option>
                    {chantiers.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">TVA %</label>
                  <select className="form-select" value={form.tva_taux} onChange={e => setForm(f => ({ ...f, tva_taux: +e.target.value }))}>
                    <option value={0}>0%</option><option value={9}>9%</option><option value={19}>19%</option>
                  </select>
                </div>
              </div>

              <div className="divider" />
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm text-gray-700">Lignes de commande</h4>
                <button className="btn btn-secondary btn-sm" onClick={addLigne}><Plus size={13} /> Ajouter ligne</button>
              </div>
              <table className="data-table" style={{ fontSize: 12 }}>
                <thead><tr><th>Article</th><th>Désignation</th><th>Unité</th><th>Qté</th><th>P.U. HT</th><th>Total HT</th><th></th></tr></thead>
                <tbody>
                  {lignes.map((l, i) => (
                    <tr key={i}>
                      <td>
                        <select className="form-select" style={{ fontSize: 12, padding: '4px 8px' }} value={l.article_id} onChange={e => updLigne(i, 'article_id', e.target.value)}>
                          <option value="">—</option>
                          {articles.map(a => <option key={a.id} value={a.id}>{a.designation}</option>)}
                        </select>
                      </td>
                      <td><input className="form-input" style={{ fontSize: 12, padding: '4px 8px' }} value={l.designation} onChange={e => updLigne(i, 'designation', e.target.value)} /></td>
                      <td><input className="form-input" style={{ fontSize: 12, padding: '4px 8px', width: 70 }} value={l.unite} onChange={e => updLigne(i, 'unite', e.target.value)} /></td>
                      <td><input className="form-input" style={{ fontSize: 12, padding: '4px 8px', width: 70 }} type="number" value={l.quantite_commandee} onChange={e => updLigne(i, 'quantite_commandee', e.target.value)} /></td>
                      <td><input className="form-input" style={{ fontSize: 12, padding: '4px 8px', width: 100 }} type="number" value={l.prix_unitaire_ht} onChange={e => updLigne(i, 'prix_unitaire_ht', e.target.value)} /></td>
                      <td className="font-semibold">{fmt(l.montant_ht)}</td>
                      <td><button className="btn btn-ghost btn-sm" style={{ color: '#ef4444', padding: '2px 6px' }} onClick={() => setLignes(lg => lg.filter((_, j) => j !== i))}><X size={12} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end gap-8 mt-3 text-sm">
                <span>HT : <strong>{fmt(totalHT)}</strong></span>
                <span>TVA ({form.tva_taux}%) : <strong>{fmt(totalHT * form.tva_taux / 100)}</strong></span>
                <span className="text-orange font-bold text-base">TTC : {fmt(totalTTC)}</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={save}>Créer le BC</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── ONGLET FACTURES ─────────────────────────────────────────────────────────
function OngletFactures() {
  const [data, setData] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [bcs, setBcs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPaiement, setShowPaiement] = useState(null);
  const [form, setForm] = useState({ fournisseur_id: '', bon_commande_id: '', numero_facture: '', date_facture: new Date().toISOString().split('T')[0], date_echeance: '', montant_ht: '', tva_taux: 19, montant_tva: 0, montant_ttc: 0, statut_paiement: 'EN_ATTENTE' });
  const [paiForm, setPaiForm] = useState({ montant: '', date_paiement: new Date().toISOString().split('T')[0], mode_paiement: 'VIREMENT', reference: '' });

  const load = () => {
    api.get('/factures-fournisseur').then(r => r?.success && setData(r.data));
    api.get('/fournisseurs').then(r => r?.success && setFournisseurs(r.data));
    api.get('/bons-commande').then(r => r?.success && setBcs(r.data));
  };
  useEffect(load, []);

  const save = async () => {
    await api.post('/factures-fournisseur', { ...form, fournisseur_id: +form.fournisseur_id, bon_commande_id: form.bon_commande_id ? +form.bon_commande_id : undefined, montant_ht: +form.montant_ht, montant_tva: +form.montant_ht * form.tva_taux / 100, montant_ttc: +form.montant_ht * (1 + form.tva_taux / 100) });
    setShowModal(false); load();
  };

  const enregPaiement = async () => {
    await api.post(`/factures-fournisseur/${showPaiement.id}/paiement`, { ...paiForm, montant: +paiForm.montant });
    setShowPaiement(null); load();
  };

  const now = new Date();

  return (
    <>
      <div className="flex justify-end mb-4">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={15} /> Saisir facture</button>
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>N° Facture</th><th>Fournisseur</th><th>Date</th><th>Échéance</th><th>Montant TTC</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>
            {data.length === 0
              ? <tr><td colSpan={7} className="text-center py-8 text-muted">Aucune facture</td></tr>
              : data.map(f => {
                const echue = f.date_echeance && new Date(f.date_echeance) < now && f.statut_paiement !== 'PAYE';
                return (
                  <tr key={f.id} style={{ background: echue ? '#fff1f2' : undefined }}>
                    <td className="font-mono font-semibold text-sm">{f.numero_facture}</td>
                    <td>{f.fournisseur?.raison_sociale}</td>
                    <td>{fmtDate(f.date_facture)}</td>
                    <td className={echue ? 'text-danger font-semibold' : ''}>{fmtDate(f.date_echeance)}{echue && ' ⚠️'}</td>
                    <td className="font-semibold">{fmt(f.montant_ttc)}</td>
                    <td><span className={`badge ${STATUT_FAC[f.statut_paiement] || 'badge-gray'}`}>{f.statut_paiement?.replace(/_/g, ' ')}</span></td>
                    <td>
                      {f.statut_paiement !== 'PAYE' && (
                        <button className="btn btn-primary btn-sm" onClick={() => setShowPaiement(f)}>Paiement</button>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-content" style={{ maxWidth: 560 }}>
            <div className="modal-header">
              <span className="modal-title">Saisir une facture fournisseur</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Fournisseur</label>
                  <select className="form-select" value={form.fournisseur_id} onChange={e => setForm(f => ({ ...f, fournisseur_id: e.target.value }))}>
                    <option value="">—</option>{fournisseurs.map(f => <option key={f.id} value={f.id}>{f.raison_sociale}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">BC associé</label>
                  <select className="form-select" value={form.bon_commande_id} onChange={e => setForm(f => ({ ...f, bon_commande_id: e.target.value }))}>
                    <option value="">— Aucun —</option>{bcs.map(b => <option key={b.id} value={b.id}>{b.numero_bc}</option>)}
                  </select>
                </div>
                <div><label className="form-label">N° Facture *</label><input className="form-input" value={form.numero_facture} onChange={e => setForm(f => ({ ...f, numero_facture: e.target.value }))} /></div>
                <div><label className="form-label">Date facture *</label><input className="form-input" type="date" value={form.date_facture} onChange={e => setForm(f => ({ ...f, date_facture: e.target.value }))} /></div>
                <div><label className="form-label">Date échéance</label><input className="form-input" type="date" value={form.date_echeance} onChange={e => setForm(f => ({ ...f, date_echeance: e.target.value }))} /></div>
                <div><label className="form-label">TVA %</label>
                  <select className="form-select" value={form.tva_taux} onChange={e => setForm(f => ({ ...f, tva_taux: +e.target.value }))}>
                    <option value={0}>0%</option><option value={9}>9%</option><option value={19}>19%</option>
                  </select>
                </div>
                <div className="col-span-2"><label className="form-label">Montant HT *</label><input className="form-input" type="number" value={form.montant_ht} onChange={e => setForm(f => ({ ...f, montant_ht: e.target.value }))} /></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={save}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {showPaiement && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowPaiement(null)}>
          <div className="modal-content" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <span className="modal-title">Enregistrer un paiement</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowPaiement(null)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <p className="text-sm text-muted mb-3">Facture : <strong>{showPaiement.numero_facture}</strong> — Restant : <strong>{fmt(showPaiement.montant_ttc - (showPaiement.paiements?.reduce((s, p) => s + p.montant, 0) || 0))}</strong></p>
              <div className="space-y-3">
                <div><label className="form-label">Montant *</label><input className="form-input" type="number" value={paiForm.montant} onChange={e => setPaiForm(f => ({ ...f, montant: e.target.value }))} /></div>
                <div><label className="form-label">Date</label><input className="form-input" type="date" value={paiForm.date_paiement} onChange={e => setPaiForm(f => ({ ...f, date_paiement: e.target.value }))} /></div>
                <div><label className="form-label">Mode</label>
                  <select className="form-select" value={paiForm.mode_paiement} onChange={e => setPaiForm(f => ({ ...f, mode_paiement: e.target.value }))}>
                    {['ESPECES', 'VIREMENT', 'CHEQUE', 'TRAITE'].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div><label className="form-label">Référence</label><input className="form-input" value={paiForm.reference} onChange={e => setPaiForm(f => ({ ...f, reference: e.target.value }))} /></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowPaiement(null)}>Annuler</button>
              <button className="btn btn-primary" onClick={enregPaiement}>Enregistrer le paiement</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── PAGE PRINCIPALE ACHATS ──────────────────────────────────────────────────
const TABS = [
  { id: 'fournisseurs', label: 'Fournisseurs', icon: Truck },
  { id: 'bc', label: 'Bons de commande', icon: ShoppingCart },
  { id: 'factures', label: 'Factures', icon: Receipt },
];

export default function Achats() {
  const [tab, setTab] = useState('fournisseurs');
  return (
    <div className="p-6 md:p-8 animate-slide-up">
      <div className="page-header">
        <div><h1 className="page-title">Achats & Fournisseurs</h1><p className="page-subtitle">Commandes, livraisons et factures fournisseurs</p></div>
      </div>
      <div className="tabs-container">
        {TABS.map(t => (
          <button key={t.id} className={`tab-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>
      {tab === 'fournisseurs' && <OngletFournisseurs />}
      {tab === 'bc' && <OngletBC />}
      {tab === 'factures' && <OngletFactures />}
    </div>
  );
}
