import React, { useState, useEffect } from 'react';
import { Plus, X, Users, Home, FileText, DollarSign } from 'lucide-react';
import { api } from '../utils/api';

const fmt = (v) => new Intl.NumberFormat('fr-DZ').format(Math.round(v || 0)) + ' DA';
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('fr-DZ') : '—';

// ─── CLIENTS ─────────────────────────────────────────────────────────────────
function OngletClients() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const empty = { type_client: 'PARTICULIER', nom_complet: '', cin_ou_rc: '', telephone: '', email: '', wilaya: 'Alger', adresse: '' };
  const [form, setForm] = useState(empty);

  const load = () => api.get('/clients').then(r => r?.success && setData(r.data));
  useEffect(load, []);

  const save = async () => {
    if (editing) await api.put(`/clients/${editing.id}`, form);
    else await api.post('/clients', form);
    setShowModal(false); setEditing(null); setForm(empty); load();
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <>
      <div className="flex justify-end mb-4">
        <button className="btn btn-primary" onClick={() => { setEditing(null); setForm(empty); setShowModal(true); }}>
          <Plus size={15} /> Nouveau client
        </button>
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Nom complet</th><th>Type</th><th>CIN/RC</th><th>Téléphone</th><th>Wilaya</th><th></th></tr></thead>
          <tbody>
            {data.length === 0
              ? <tr><td colSpan={6} className="text-center py-8 text-muted">Aucun client</td></tr>
              : data.map(c => (
                <tr key={c.id}>
                  <td className="font-semibold">{c.nom_complet}</td>
                  <td><span className={`badge ${c.type_client === 'PARTICULIER' ? 'badge-info' : 'badge-orange'}`}>{c.type_client}</span></td>
                  <td className="font-mono text-xs text-muted">{c.cin_ou_rc || '—'}</td>
                  <td>{c.telephone || '—'}</td>
                  <td>{c.wilaya || '—'}</td>
                  <td><button className="btn btn-ghost btn-sm" onClick={() => { setEditing(c); setForm(c); setShowModal(true); }}>✏️</button></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-content" style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Modifier' : 'Nouveau'} client</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Type *</label>
                  <select className="form-select" value={form.type_client} onChange={e => set('type_client', e.target.value)}>
                    <option value="PARTICULIER">Particulier</option><option value="ENTREPRISE">Entreprise</option>
                  </select>
                </div>
                <div><label className="form-label">CIN / RC</label><input className="form-input" value={form.cin_ou_rc || ''} onChange={e => set('cin_ou_rc', e.target.value)} /></div>
                <div className="col-span-2"><label className="form-label">Nom complet *</label><input className="form-input" value={form.nom_complet} onChange={e => set('nom_complet', e.target.value)} /></div>
                <div><label className="form-label">Téléphone</label><input className="form-input" value={form.telephone || ''} onChange={e => set('telephone', e.target.value)} /></div>
                <div><label className="form-label">Email</label><input className="form-input" type="email" value={form.email || ''} onChange={e => set('email', e.target.value)} /></div>
                <div><label className="form-label">Wilaya</label><input className="form-input" value={form.wilaya || ''} onChange={e => set('wilaya', e.target.value)} /></div>
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

// ─── CONTRATS VENTE ───────────────────────────────────────────────────────────
function OngletContrats() {
  const [data, setData] = useState([]);
  const [clients, setClients] = useState([]);
  const [lots, setLots] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [echeances, setEcheances] = useState([{ date_echeance: '', montant_appel: '' }]);
  const [form, setForm] = useState({ client_id: '', lot_id: '', numero_contrat: `CV-${Date.now()}`, date_contrat: new Date().toISOString().split('T')[0], prix_total_ttc: '', montant_apport: 0, mode_financement: 'ECHELONNE', notaire: '' });

  const load = () => {
    api.get('/contrats-vente').then(r => r?.success && setData(r.data));
    api.get('/clients').then(r => r?.success && setClients(r.data));
    api.get('/projects').then(r => r?.success && setProjects(r.data));
  };
  useEffect(load, []);

  const lotsDispos = lots.filter(l => l.statut === 'DISPONIBLE');

  const loadLots = (pid) => {
    if (!pid) return;
    api.get(`/lots?project_id=${pid}`).then(r => r?.success && setLots(r.data));
  };

  const save = async () => {
    await api.post('/contrats-vente', {
      ...form, client_id: +form.client_id, lot_id: +form.lot_id, prix_total_ttc: +form.prix_total_ttc, montant_apport: +form.montant_apport,
      statut: 'SIGNE',
      echeances: echeances.filter(e => e.date_echeance && e.montant_appel).map(e => ({ ...e, montant_appel: +e.montant_appel }))
    });
    setShowModal(false); load();
  };

  const addEch = () => setEcheances(e => [...e, { date_echeance: '', montant_appel: '' }]);
  const updEch = (i, k, v) => setEcheances(e => e.map((x, j) => j === i ? { ...x, [k]: v } : x));
  const totalEch = echeances.reduce((s, e) => s + (+e.montant_appel || 0), 0);

  const STATUT_C = { BROUILLON: 'badge-gray', SIGNE: 'badge-success', ANNULE: 'badge-danger', SOLDE: 'badge-info' };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={15} /> Nouveau contrat</button>
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>N° Contrat</th><th>Client</th><th>Lot</th><th>Date</th><th>Prix TTC</th><th>Financement</th><th>Statut</th></tr></thead>
          <tbody>
            {data.length === 0
              ? <tr><td colSpan={7} className="text-center py-8 text-muted">Aucun contrat de vente</td></tr>
              : data.map(c => (
                <tr key={c.id}>
                  <td className="font-mono font-semibold text-sm">{c.numero_contrat}</td>
                  <td className="font-semibold">{c.client?.nom_complet}</td>
                  <td className="text-muted text-sm">{c.lot?.numero_lot}</td>
                  <td>{fmtDate(c.date_contrat)}</td>
                  <td className="font-bold">{fmt(c.prix_total_ttc)}</td>
                  <td><span className="badge badge-info text-xs">{c.mode_financement}</span></td>
                  <td><span className={`badge ${STATUT_C[c.statut] || 'badge-gray'}`}>{c.statut}</span></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-content" style={{ maxWidth: 680 }}>
            <div className="modal-header">
              <span className="modal-title">Nouveau contrat de vente</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><label className="form-label">N° Contrat</label><input className="form-input" value={form.numero_contrat} onChange={e => setForm(f => ({ ...f, numero_contrat: e.target.value }))} /></div>
                <div><label className="form-label">Date</label><input className="form-input" type="date" value={form.date_contrat} onChange={e => setForm(f => ({ ...f, date_contrat: e.target.value }))} /></div>
                <div>
                  <label className="form-label">Client *</label>
                  <select className="form-select" value={form.client_id} onChange={e => setForm(f => ({ ...f, client_id: e.target.value }))}>
                    <option value="">—</option>{clients.map(c => <option key={c.id} value={c.id}>{c.nom_complet}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Projet *</label>
                  <select className="form-select" onChange={e => { loadLots(e.target.value); }}>
                    <option value="">—</option>{projects.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Lot *</label>
                  <select className="form-select" value={form.lot_id} onChange={e => { const l = lots.find(x => x.id === +e.target.value); setForm(f => ({ ...f, lot_id: e.target.value, prix_total_ttc: l?.prix_vente_ttc || f.prix_total_ttc })); }}>
                    <option value="">—</option>
                    {lotsDispos.map(l => <option key={l.id} value={l.id}>{l.numero_lot} — {l.type_bien} — {fmt(l.prix_vente_ttc)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Financement</label>
                  <select className="form-select" value={form.mode_financement} onChange={e => setForm(f => ({ ...f, mode_financement: e.target.value }))}>
                    {['COMPTANT', 'CREDOC', 'CREDIT_IMMOBILIER', 'ECHELONNE'].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div><label className="form-label">Prix total TTC *</label><input className="form-input" type="number" value={form.prix_total_ttc} onChange={e => setForm(f => ({ ...f, prix_total_ttc: e.target.value }))} /></div>
                <div><label className="form-label">Apport initial</label><input className="form-input" type="number" value={form.montant_apport} onChange={e => setForm(f => ({ ...f, montant_apport: e.target.value }))} /></div>
              </div>

              <div className="divider" />
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700">📅 Échéances de paiement</h4>
                <button className="btn btn-secondary btn-sm" onClick={addEch}><Plus size={13} /> Ajouter tranche</button>
              </div>
              {echeances.map((e, i) => (
                <div key={i} className="flex gap-3 mb-2 items-center">
                  <span className="text-xs text-muted w-16 flex-shrink-0">Tranche {i + 1}</span>
                  <input className="form-input" type="date" value={e.date_echeance} onChange={x => updEch(i, 'date_echeance', x.target.value)} />
                  <input className="form-input" type="number" placeholder="Montant DA" value={e.montant_appel} onChange={x => updEch(i, 'montant_appel', x.target.value)} />
                  <button className="btn btn-ghost btn-sm text-danger" onClick={() => setEcheances(ec => ec.filter((_, j) => j !== i))}><X size={12} /></button>
                </div>
              ))}
              {form.prix_total_ttc && (
                <div className="text-sm mt-2">
                  Total tranches : <strong>{fmt(totalEch)}</strong>
                  {+form.prix_total_ttc > 0 && totalEch !== +form.prix_total_ttc && (
                    <span className="text-danger ml-2">⚠ Écart : {fmt(+form.prix_total_ttc - totalEch)}</span>
                  )}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={save}>Créer le contrat</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── ENCAISSEMENTS ────────────────────────────────────────────────────────────
function OngletEncaissements() {
  const [echeances, setEcheances] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [paiForm, setPaiForm] = useState({ montant: '', date_encaissement: new Date().toISOString().split('T')[0], mode_paiement: 'VIREMENT', reference_paiement: '' });

  const load = () => api.get('/echeances-paiement').then(r => r?.success && setEcheances(r.data));
  useEffect(load, []);

  const save = async () => {
    await api.post('/encaissements', { ...paiForm, echeance_id: showModal.id, montant: +paiForm.montant });
    setShowModal(null); load();
  };

  const now = new Date();
  const STATUT_E = { EN_ATTENTE: 'badge-warning', PARTIELLEMENT_PAYEE: 'badge-info', PAYEE: 'badge-success', EN_RETARD: 'badge-danger' };

  return (
    <>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Client</th><th>Tranche</th><th>Échéance</th><th>Attendu</th><th>Encaissé</th><th>Reste</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>
            {echeances.length === 0
              ? <tr><td colSpan={8} className="text-center py-8 text-muted">Aucune échéance</td></tr>
              : echeances.map(e => {
                const enRetard = e.statut !== 'PAYEE' && new Date(e.date_echeance) < now;
                const statut = enRetard && e.statut === 'EN_ATTENTE' ? 'EN_RETARD' : e.statut;
                const reste = e.montant_appel - e.montant_encaisse;
                return (
                  <tr key={e.id} style={{ background: enRetard ? '#fff1f2' : undefined }}>
                    <td className="font-semibold text-sm">{e.contrat_vente?.client?.nom_complet}</td>
                    <td className="text-center font-semibold text-muted">#{e.numero_tranche}</td>
                    <td className={enRetard ? 'text-danger font-semibold' : ''}>{fmtDate(e.date_echeance)}{enRetard && ' ⚠️'}</td>
                    <td>{fmt(e.montant_appel)}</td>
                    <td className="text-success font-semibold">{fmt(e.montant_encaisse)}</td>
                    <td className={reste > 0 ? 'text-danger font-bold' : 'text-success'}>{fmt(reste)}</td>
                    <td><span className={`badge ${STATUT_E[statut] || 'badge-gray'}`}>{statut?.replace(/_/g, ' ')}</span></td>
                    <td>
                      {e.statut !== 'PAYEE' && (
                        <button className="btn btn-primary btn-sm" onClick={() => { setShowModal(e); setPaiForm(f => ({ ...f, montant: reste })); }}>
                          💰 Encaisser
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(null)}>
          <div className="modal-content" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <span className="modal-title">Enregistrer un encaissement</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(null)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <p className="text-sm text-muted mb-3">Tranche #{showModal.numero_tranche} — Reste à encaisser : <strong>{fmt(showModal.montant_appel - showModal.montant_encaisse)}</strong></p>
              <div className="space-y-3">
                <div><label className="form-label">Montant *</label><input className="form-input" type="number" value={paiForm.montant} onChange={e => setPaiForm(f => ({ ...f, montant: e.target.value }))} /></div>
                <div><label className="form-label">Date</label><input className="form-input" type="date" value={paiForm.date_encaissement} onChange={e => setPaiForm(f => ({ ...f, date_encaissement: e.target.value }))} /></div>
                <div>
                  <label className="form-label">Mode</label>
                  <select className="form-select" value={paiForm.mode_paiement} onChange={e => setPaiForm(f => ({ ...f, mode_paiement: e.target.value }))}>
                    {['ESPECES', 'VIREMENT', 'CHEQUE'].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div><label className="form-label">Référence</label><input className="form-input" value={paiForm.reference_paiement} onChange={e => setPaiForm(f => ({ ...f, reference_paiement: e.target.value }))} /></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(null)}>Annuler</button>
              <button className="btn btn-primary" onClick={save}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const TABS = [
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'contrats', label: 'Contrats de vente', icon: FileText },
  { id: 'encaissements', label: 'Encaissements', icon: DollarSign },
];

export default function Commercial() {
  const [tab, setTab] = useState('clients');
  return (
    <div className="p-6 md:p-8 animate-slide-up">
      <div className="page-header">
        <div><h1 className="page-title">Commercial Clients</h1><p className="page-subtitle">Clients, contrats de vente et encaissements</p></div>
      </div>
      <div className="tabs-container">
        {TABS.map(t => <button key={t.id} className={`tab-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}><t.icon size={14} /> {t.label}</button>)}
      </div>
      {tab === 'clients' && <OngletClients />}
      {tab === 'contrats' && <OngletContrats />}
      {tab === 'encaissements' && <OngletEncaissements />}
    </div>
  );
}
