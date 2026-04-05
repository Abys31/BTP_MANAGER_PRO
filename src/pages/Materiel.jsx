import React, { useState, useEffect } from 'react';
import { Plus, X, Car, Wrench, MapPin, TrendingDown } from 'lucide-react';
import { api } from '../utils/api';

const fmt = (v) => new Intl.NumberFormat('fr-DZ').format(Math.round(v || 0)) + ' DA';
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('fr-DZ') : '—';

const CATEGORIES = ['ENGIN_TP', 'VEHICULE', 'OUTILLAGE', 'EQUIPEMENT_BUREAU', 'MATERIEL_INFORMATIQUE'];
const STATUTS = { EN_SERVICE: 'badge-success', EN_MAINTENANCE: 'badge-warning', HORS_SERVICE: 'badge-danger', CEDE: 'badge-gray' };

function OngletMateriel() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [amortTab, setAmortTab] = useState(null);
  const [amortData, setAmortData] = useState([]);
  const empty = { code: '', designation: '', categorie: 'VEHICULE', marque: '', modele: '', numero_serie: '', date_acquisition: '', valeur_acquisition: '', duree_amortissement_ans: 5, valeur_residuelle: 0, statut: 'EN_SERVICE', notes: '' };
  const [form, setForm] = useState(empty);

  const load = () => api.get('/immobilisations').then(r => r?.success && setData(r.data));
  useEffect(load, []);

  const save = async () => {
    const payload = { ...form, valeur_acquisition: +form.valeur_acquisition, duree_amortissement_ans: +form.duree_amortissement_ans, valeur_residuelle: +form.valeur_residuelle };
    if (editing) await api.put(`/immobilisations/${editing.id}`, payload);
    else await api.post('/immobilisations', payload);
    setShowModal(false); setEditing(null); setForm(empty); load();
  };

  const voirAmort = async (immo) => {
    const r = await api.get(`/immobilisations/${immo.id}/amortissement`);
    if (r?.success) { setAmortData(r.data); setAmortTab(immo); }
  };

  const openEdit = (i) => { setEditing(i); setForm({ ...i, date_acquisition: i.date_acquisition?.split('T')[0] || '' }); setShowModal(true); };
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const calcVNC = (immo) => {
    const ans = (new Date() - new Date(immo.date_acquisition)) / (365.25 * 86400000);
    const amortAnnuel = (immo.valeur_acquisition - immo.valeur_residuelle) / immo.duree_amortissement_ans;
    return Math.max(immo.valeur_residuelle, immo.valeur_acquisition - amortAnnuel * Math.min(ans, immo.duree_amortissement_ans));
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button className="btn btn-primary" onClick={() => { setEditing(null); setForm(empty); setShowModal(true); }}>
          <Plus size={15} /> Nouvelle immobilisation
        </button>
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Code</th><th>Désignation</th><th>Catégorie</th><th>Marque/Modèle</th><th>Date acq.</th><th>Valeur acq.</th><th>VNC actuelle</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>
            {data.length === 0
              ? <tr><td colSpan={9} className="text-center py-8 text-muted">Aucune immobilisation</td></tr>
              : data.map(i => (
                <tr key={i.id}>
                  <td className="font-mono text-xs">{i.code}</td>
                  <td className="font-semibold">{i.designation}</td>
                  <td><span className="badge badge-info text-xs">{i.categorie}</span></td>
                  <td className="text-muted text-sm">{[i.marque, i.modele].filter(Boolean).join(' ')}</td>
                  <td className="text-sm">{fmtDate(i.date_acquisition)}</td>
                  <td>{fmt(i.valeur_acquisition)}</td>
                  <td className="font-semibold text-orange">{fmt(calcVNC(i))}</td>
                  <td><span className={`badge ${STATUTS[i.statut] || 'badge-gray'}`}>{i.statut}</span></td>
                  <td>
                    <div className="flex gap-1">
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(i)}>✏️</button>
                      <button className="btn btn-ghost btn-sm text-blue-600" onClick={() => voirAmort(i)} title="Tableau amortissement">📊</button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {amortTab && (
        <div className="modal-overlay" onClick={() => setAmortTab(null)}>
          <div className="modal-content" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Tableau d'amortissement — {amortTab.designation}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setAmortTab(null)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <table className="data-table">
                <thead><tr><th>Année</th><th>Valeur brute</th><th>Amort. annuel</th><th>Amort. cumulé</th><th>VNC</th></tr></thead>
                <tbody>
                  {amortData.map((r, i) => (
                    <tr key={i}>
                      <td>{r.annee}</td>
                      <td>{fmt(r.valeur_brute)}</td>
                      <td>{fmt(r.amort_annuel)}</td>
                      <td>{fmt(r.amort_cumul)}</td>
                      <td className="font-semibold text-orange">{fmt(r.vnc)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-content" style={{ maxWidth: 600 }}>
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Modifier' : 'Nouvelle'} immobilisation</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="form-label">Code *</label><input className="form-input" value={form.code} onChange={e => set('code', e.target.value)} /></div>
                <div>
                  <label className="form-label">Catégorie</label>
                  <select className="form-select" value={form.categorie} onChange={e => set('categorie', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-span-2"><label className="form-label">Désignation *</label><input className="form-input" value={form.designation} onChange={e => set('designation', e.target.value)} /></div>
                <div><label className="form-label">Marque</label><input className="form-input" value={form.marque || ''} onChange={e => set('marque', e.target.value)} /></div>
                <div><label className="form-label">Modèle</label><input className="form-input" value={form.modele || ''} onChange={e => set('modele', e.target.value)} /></div>
                <div><label className="form-label">Date acquisition *</label><input className="form-input" type="date" value={form.date_acquisition} onChange={e => set('date_acquisition', e.target.value)} /></div>
                <div><label className="form-label">Valeur acquisition (DA) *</label><input className="form-input" type="number" value={form.valeur_acquisition} onChange={e => set('valeur_acquisition', e.target.value)} /></div>
                <div><label className="form-label">Durée amortissement (ans)</label><input className="form-input" type="number" value={form.duree_amortissement_ans} onChange={e => set('duree_amortissement_ans', e.target.value)} /></div>
                <div><label className="form-label">Valeur résiduelle (DA)</label><input className="form-input" type="number" value={form.valeur_residuelle} onChange={e => set('valeur_residuelle', e.target.value)} /></div>
                <div>
                  <label className="form-label">Statut</label>
                  <select className="form-select" value={form.statut} onChange={e => set('statut', e.target.value)}>
                    {Object.keys(STATUTS).map(s => <option key={s}>{s}</option>)}
                  </select>
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

function OngletMaintenance() {
  const [data, setData] = useState([]);
  const [immobilisations, setImmobilisations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ immobilisation_id: '', type_maintenance: 'PREVENTIVE', date_maintenance: new Date().toISOString().split('T')[0], cout: '', prestataire: '', prochain_entretien_date: '', description: '' });

  const load = () => {
    api.get('/maintenances').then(r => r?.success && setData(r.data));
    api.get('/immobilisations').then(r => r?.success && setImmobilisations(r.data));
  };
  useEffect(load, []);

  const save = async () => {
    await api.post('/maintenances', { ...form, immobilisation_id: +form.immobilisation_id, cout: +form.cout });
    setShowModal(false); load();
  };

  const now = new Date();
  return (
    <>
      <div className="flex justify-end mb-4">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={15} /> Saisir maintenance</button>
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Matériel</th><th>Type</th><th>Date</th><th>Coût</th><th>Prestataire</th><th>Prochain entretien</th></tr></thead>
          <tbody>
            {data.length === 0
              ? <tr><td colSpan={6} className="text-center py-8 text-muted">Aucune maintenance</td></tr>
              : data.map(m => {
                const depasse = m.prochain_entretien_date && new Date(m.prochain_entretien_date) < now;
                return (
                  <tr key={m.id}>
                    <td className="font-semibold">{m.immobilisation?.designation}</td>
                    <td><span className="badge badge-info text-xs">{m.type_maintenance}</span></td>
                    <td>{fmtDate(m.date_maintenance)}</td>
                    <td className="font-semibold">{fmt(m.cout)}</td>
                    <td className="text-muted">{m.prestataire || '—'}</td>
                    <td className={depasse ? 'text-danger font-semibold' : ''}>{fmtDate(m.prochain_entretien_date)}{depasse && ' ⚠️'}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-content" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <span className="modal-title">Saisir une maintenance</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="space-y-3">
                <div>
                  <label className="form-label">Matériel *</label>
                  <select className="form-select" value={form.immobilisation_id} onChange={e => setForm(f => ({ ...f, immobilisation_id: e.target.value }))}>
                    <option value="">—</option>{immobilisations.map(i => <option key={i.id} value={i.id}>{i.designation}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Type</label>
                    <select className="form-select" value={form.type_maintenance} onChange={e => setForm(f => ({ ...f, type_maintenance: e.target.value }))}>
                      {['PREVENTIVE', 'CORRECTIVE', 'REVISION'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div><label className="form-label">Date</label><input className="form-input" type="date" value={form.date_maintenance} onChange={e => setForm(f => ({ ...f, date_maintenance: e.target.value }))} /></div>
                  <div><label className="form-label">Coût (DA)</label><input className="form-input" type="number" value={form.cout} onChange={e => setForm(f => ({ ...f, cout: e.target.value }))} /></div>
                  <div><label className="form-label">Prestataire</label><input className="form-input" value={form.prestataire} onChange={e => setForm(f => ({ ...f, prestataire: e.target.value }))} /></div>
                </div>
                <div><label className="form-label">Prochain entretien</label><input className="form-input" type="date" value={form.prochain_entretien_date} onChange={e => setForm(f => ({ ...f, prochain_entretien_date: e.target.value }))} /></div>
                <div><label className="form-label">Description</label><textarea className="form-input" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
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

const TABS = [
  { id: 'materiel', label: 'Matériel & Engins', icon: Car },
  { id: 'maintenance', label: 'Maintenances', icon: Wrench },
];

export default function Materiel() {
  const [tab, setTab] = useState('materiel');
  return (
    <div className="p-6 md:p-8 animate-slide-up">
      <div className="page-header">
        <div><h1 className="page-title">Immobilisations</h1><p className="page-subtitle">Matériel, amortissements et maintenances</p></div>
      </div>
      <div className="tabs-container">
        {TABS.map(t => <button key={t.id} className={`tab-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}><t.icon size={14} /> {t.label}</button>)}
      </div>
      {tab === 'materiel' && <OngletMateriel />}
      {tab === 'maintenance' && <OngletMaintenance />}
    </div>
  );
}
