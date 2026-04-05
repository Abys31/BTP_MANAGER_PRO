import React, { useState, useEffect } from 'react';
import { Plus, X, Trash2, TrendingDown, Building, Users } from 'lucide-react';
import { api } from '../utils/api';

const fmt = (v) => new Intl.NumberFormat('fr-DZ').format(Math.round(v || 0)) + ' DA';
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('fr-DZ') : '—';

const CAT_DEPENSE = ['LOCATION_MATERIEL', 'SOUS_TRAITANCE', 'HONORAIRES', 'ASSURANCE', 'TRANSPORT', 'CARBURANT', 'ELECTRICITE', 'COMMUNICATION', 'AUTRE'];

function OngletDepenses() {
  const [data, setData] = useState([]);
  const [chantiers, setChantiers] = useState([]);
  const [filterChan, setFilterChan] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ chantier_id: '', categorie_depense: 'AUTRE', description: '', montant_ht: '', tva_taux: 19, date_depense: new Date().toISOString().split('T')[0], statut_paiement: 'NON_PAYE' });

  const load = () => {
    api.get('/depenses-directes').then(r => r?.success && setData(r.data));
    api.get('/chantiers').then(r => r?.success && setChantiers(r.data));
  };
  useEffect(load, []);

  const save = async () => {
    const ht = +form.montant_ht;
    await api.post('/depenses-directes', { ...form, chantier_id: +form.chantier_id, montant_ht: ht, montant_ttc: ht * (1 + form.tva_taux / 100) });
    setShowModal(false); load();
  };

  const remove = async (id) => {
    if (!confirm('Supprimer ?')) return;
    await api.delete(`/depenses-directes/${id}`); load();
  };

  const filtered = filterChan ? data.filter(d => d.chantier_id === +filterChan) : data;
  const total = filtered.reduce((s, d) => s + d.montant_ttc, 0);

  return (
    <>
      <div className="flex gap-3 mb-4 flex-wrap">
        <select className="form-select" style={{ width: 220 }} value={filterChan} onChange={e => setFilterChan(e.target.value)}>
          <option value="">Tous les chantiers</option>
          {chantiers.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
        </select>
        <div className="flex-1" />
        <span className="text-sm font-semibold self-center text-orange">Total TTC : {fmt(total)}</span>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={15} /> Nouvelle dépense</button>
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Date</th><th>Chantier</th><th>Catégorie</th><th>Description</th><th>Montant HT</th><th>TTC</th><th>Statut</th><th></th></tr></thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={8} className="text-center py-8 text-muted">Aucune dépense</td></tr>
              : filtered.map(d => (
                <tr key={d.id}>
                  <td className="text-sm">{fmtDate(d.date_depense)}</td>
                  <td className="text-sm text-muted">{d.chantier?.nom}</td>
                  <td><span className="badge badge-gray text-xs">{d.categorie_depense}</span></td>
                  <td className="font-medium text-sm">{d.description}</td>
                  <td>{fmt(d.montant_ht)}</td>
                  <td className="font-semibold">{fmt(d.montant_ttc)}</td>
                  <td><span className={`badge ${d.statut_paiement === 'PAYE' ? 'badge-success' : 'badge-warning'}`}>{d.statut_paiement}</span></td>
                  <td><button className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }} onClick={() => remove(d.id)}><Trash2 size={13} /></button></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-content" style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <span className="modal-title">Nouvelle dépense directe</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Chantier *</label>
                  <select className="form-select" value={form.chantier_id} onChange={e => setForm(f => ({ ...f, chantier_id: e.target.value }))}>
                    <option value="">—</option>{chantiers.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Catégorie</label>
                  <select className="form-select" value={form.categorie_depense} onChange={e => setForm(f => ({ ...f, categorie_depense: e.target.value }))}>
                    {CAT_DEPENSE.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-span-2"><label className="form-label">Description *</label><input className="form-input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
                <div><label className="form-label">Montant HT *</label><input className="form-input" type="number" value={form.montant_ht} onChange={e => setForm(f => ({ ...f, montant_ht: e.target.value }))} /></div>
                <div>
                  <label className="form-label">TVA %</label>
                  <select className="form-select" value={form.tva_taux} onChange={e => setForm(f => ({ ...f, tva_taux: +e.target.value }))}>
                    <option value={0}>0%</option><option value={9}>9%</option><option value={19}>19%</option>
                  </select>
                </div>
                <div><label className="form-label">Date</label><input className="form-input" type="date" value={form.date_depense} onChange={e => setForm(f => ({ ...f, date_depense: e.target.value }))} /></div>
                <div>
                  <label className="form-label">Statut paiement</label>
                  <select className="form-select" value={form.statut_paiement} onChange={e => setForm(f => ({ ...f, statut_paiement: e.target.value }))}>
                    <option value="NON_PAYE">Non payé</option><option value="PAYE">Payé</option>
                  </select>
                </div>
                {form.montant_ht && <div className="col-span-2 text-sm font-semibold text-orange">TTC = {fmt(+form.montant_ht * (1 + form.tva_taux / 100))}</div>}
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

function OngletCharges() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const empty = { designation: '', montant_mensuel: '', date_debut: '', date_fin: '', actif: true };
  const [form, setForm] = useState(empty);

  const load = () => api.get('/charges-fixes').then(r => r?.success && setData(r.data));
  useEffect(load, []);

  const save = async () => {
    const payload = { ...form, montant_mensuel: +form.montant_mensuel };
    if (editing) await api.put(`/charges-fixes/${editing.id}`, payload);
    else await api.post('/charges-fixes', payload);
    setShowModal(false); setEditing(null); setForm(empty); load();
  };

  const toggle = async (c) => {
    await api.put(`/charges-fixes/${c.id}`, { ...c, actif: !c.actif }); load();
  };

  const total = data.filter(c => c.actif).reduce((s, c) => s + c.montant_mensuel, 0);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-semibold text-orange">Total mensuel actif : {fmt(total)} / mois</div>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setForm(empty); setShowModal(true); }}><Plus size={15} /> Nouvelle charge</button>
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Désignation</th><th>Montant mensuel</th><th>Date début</th><th>Date fin</th><th>Statut</th><th></th></tr></thead>
          <tbody>
            {data.length === 0
              ? <tr><td colSpan={6} className="text-center py-8 text-muted">Aucune charge fixe</td></tr>
              : data.map(c => (
                <tr key={c.id} style={{ opacity: c.actif ? 1 : 0.5 }}>
                  <td className="font-semibold">{c.designation}</td>
                  <td className="font-bold text-orange">{fmt(c.montant_mensuel)}</td>
                  <td>{fmtDate(c.date_debut)}</td>
                  <td>{fmtDate(c.date_fin)}</td>
                  <td>
                    <button onClick={() => toggle(c)} className={`badge ${c.actif ? 'badge-success' : 'badge-gray'}`} style={{ cursor: 'pointer', border: 'none' }}>
                      {c.actif ? '● Actif' : '○ Inactif'}
                    </button>
                  </td>
                  <td><button className="btn btn-ghost btn-sm" onClick={() => { setEditing(c); setForm({ ...c, date_debut: c.date_debut?.split('T')[0], date_fin: c.date_fin?.split('T')[0] || '' }); setShowModal(true); }}>✏️</button></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-content" style={{ maxWidth: 460 }}>
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Modifier' : 'Nouvelle'} charge fixe</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="space-y-3">
                <div><label className="form-label">Désignation *</label><input className="form-input" value={form.designation} onChange={e => setForm(f => ({ ...f, designation: e.target.value }))} /></div>
                <div><label className="form-label">Montant mensuel (DA) *</label><input className="form-input" type="number" value={form.montant_mensuel} onChange={e => setForm(f => ({ ...f, montant_mensuel: e.target.value }))} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="form-label">Date début</label><input className="form-input" type="date" value={form.date_debut} onChange={e => setForm(f => ({ ...f, date_debut: e.target.value }))} /></div>
                  <div><label className="form-label">Date fin</label><input className="form-input" type="date" value={form.date_fin || ''} onChange={e => setForm(f => ({ ...f, date_fin: e.target.value }))} /></div>
                </div>
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

const TABS = [
  { id: 'depenses', label: 'Dépenses directes', icon: TrendingDown },
  { id: 'charges', label: 'Charges fixes', icon: Building },
];

export default function Depenses() {
  const [tab, setTab] = useState('depenses');
  return (
    <div className="p-6 md:p-8 animate-slide-up">
      <div className="page-header">
        <div><h1 className="page-title">Dépenses & Charges</h1><p className="page-subtitle">Dépenses directes par chantier et charges fixes</p></div>
      </div>
      <div className="tabs-container">
        {TABS.map(t => <button key={t.id} className={`tab-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}><t.icon size={14} /> {t.label}</button>)}
      </div>
      {tab === 'depenses' && <OngletDepenses />}
      {tab === 'charges' && <OngletCharges />}
    </div>
  );
}
