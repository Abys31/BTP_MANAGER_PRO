import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, X, Users, Calendar, Clock, DollarSign } from 'lucide-react';
import { api } from '../utils/api';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('fr-DZ') : '—';
const fmt = (v) => new Intl.NumberFormat('fr-DZ').format(Math.round(v || 0)) + ' DA';

const QUALIFICATIONS = ['INGENIEUR', 'TECHNICIEN', 'CHEF_CHANTIER', 'OUVRIER_QUALIFIE', 'OUVRIER', 'MANOEUVRE', 'GARDIEN', 'ADMINISTRATIF'];
const TYPE_CONTRAT = ['CDI', 'CDD', 'SAISONNIER', 'JOURNALIER'];
const TYPE_CONGE = ['ANNUEL', 'MALADIE', 'MATERNITE', 'SANS_SOLDE', 'AUTRE'];

// ─── ONGLET EMPLOYÉS ──────────────────────────────────────────────────────────
function OngletEmployes() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const empty = { matricule: '', nom: '', prenom: '', qualification: 'OUVRIER', poste: '', type_contrat: 'CDI', date_embauche: '', salaire_base: '', prime_chantier: 0, indemnite_transport: 0, telephone: '', nin: '', cnas_numero: '' };
  const [form, setForm] = useState(empty);

  const load = useCallback(() => {
    api.get(`/employes?search=${search}`).then(r => r?.success && setData(r.data));
  }, [search]);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    const payload = { ...form, salaire_base: +form.salaire_base, prime_chantier: +form.prime_chantier, indemnite_transport: +form.indemnite_transport };
    if (editing) await api.put(`/employes/${editing.id}`, payload);
    else await api.post('/employes', payload);
    setShowModal(false); setEditing(null); setForm(empty); load();
  };

  const openEdit = (e) => { setEditing(e); setForm({ ...e, date_embauche: e.date_embauche?.split('T')[0] || '', date_fin_contrat: e.date_fin_contrat?.split('T')[0] || '' }); setShowModal(true); };
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const now = new Date();
  const expireBientot = (e) => e.type_contrat === 'CDD' && e.date_fin_contrat && new Date(e.date_fin_contrat) <= new Date(now.getTime() + 30 * 86400000);

  return (
    <>
      <div className="flex gap-3 mb-4">
        <div className="search-input-wrapper flex-1">
          <Search size={15} className="search-icon-inner" />
          <input className="search-input" placeholder="Rechercher un employé..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setForm(empty); setShowModal(true); }}>
          <Plus size={15} /> Nouvel employé
        </button>
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Matricule</th><th>Nom Prénom</th><th>Qualification</th><th>Contrat</th><th>Embauche</th><th>Salaire base</th><th>Statut</th><th></th></tr></thead>
          <tbody>
            {data.length === 0
              ? <tr><td colSpan={8} className="text-center py-8 text-muted">Aucun employé</td></tr>
              : data.map(e => (
                <tr key={e.id} style={{ background: expireBientot(e) ? '#fffbeb' : undefined }}>
                  <td className="font-mono text-xs text-muted">{e.matricule}</td>
                  <td><div className="font-semibold">{e.nom} {e.prenom}</div><div className="text-xs text-muted">{e.poste}</div></td>
                  <td><span className="badge badge-info text-xs">{e.qualification}</span></td>
                  <td><span className={`badge ${e.type_contrat === 'CDI' ? 'badge-success' : 'badge-orange'}`}>{e.type_contrat}</span></td>
                  <td className="text-sm">{fmtDate(e.date_embauche)}</td>
                  <td className="font-semibold">{fmt(e.salaire_base)}</td>
                  <td>
                    {expireBientot(e) ? <span className="badge badge-warning">⚠ Expire {fmtDate(e.date_fin_contrat)}</span>
                      : <span className={`badge ${e.actif ? 'badge-success' : 'badge-danger'}`}>{e.actif ? 'Actif' : 'Inactif'}</span>}
                  </td>
                  <td><button className="btn btn-ghost btn-sm" onClick={() => openEdit(e)}>✏️</button></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-content" style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Modifier' : 'Nouvel'} employé</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="form-label">Matricule *</label><input className="form-input" value={form.matricule} onChange={e => set('matricule', e.target.value)} /></div>
                <div>
                  <label className="form-label">Qualification</label>
                  <select className="form-select" value={form.qualification} onChange={e => set('qualification', e.target.value)}>
                    {QUALIFICATIONS.map(q => <option key={q}>{q}</option>)}
                  </select>
                </div>
                <div><label className="form-label">Nom *</label><input className="form-input" value={form.nom} onChange={e => set('nom', e.target.value)} /></div>
                <div><label className="form-label">Prénom *</label><input className="form-input" value={form.prenom} onChange={e => set('prenom', e.target.value)} /></div>
                <div><label className="form-label">Poste</label><input className="form-input" value={form.poste || ''} onChange={e => set('poste', e.target.value)} /></div>
                <div>
                  <label className="form-label">Type contrat</label>
                  <select className="form-select" value={form.type_contrat} onChange={e => set('type_contrat', e.target.value)}>
                    {TYPE_CONTRAT.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div><label className="form-label">Date embauche *</label><input className="form-input" type="date" value={form.date_embauche} onChange={e => set('date_embauche', e.target.value)} /></div>
                {form.type_contrat === 'CDD' && (
                  <div><label className="form-label">Fin de contrat</label><input className="form-input" type="date" value={form.date_fin_contrat || ''} onChange={e => set('date_fin_contrat', e.target.value)} /></div>
                )}
                <div><label className="form-label">Salaire base (DA) *</label><input className="form-input" type="number" value={form.salaire_base} onChange={e => set('salaire_base', e.target.value)} /></div>
                <div><label className="form-label">Prime chantier</label><input className="form-input" type="number" value={form.prime_chantier} onChange={e => set('prime_chantier', e.target.value)} /></div>
                <div><label className="form-label">Indemnité transport</label><input className="form-input" type="number" value={form.indemnite_transport} onChange={e => set('indemnite_transport', e.target.value)} /></div>
                <div><label className="form-label">Téléphone</label><input className="form-input" value={form.telephone || ''} onChange={e => set('telephone', e.target.value)} /></div>
                <div><label className="form-label">NIN</label><input className="form-input" value={form.nin || ''} onChange={e => set('nin', e.target.value)} /></div>
                <div><label className="form-label">N° CNAS</label><input className="form-input" value={form.cnas_numero || ''} onChange={e => set('cnas_numero', e.target.value)} /></div>
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

// ─── ONGLET POINTAGE ─────────────────────────────────────────────────────────
function OngletPointage() {
  const [chantiers, setChantiers] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [affectations, setAffectations] = useState([]);
  const [chantierSel, setChantierSel] = useState('');
  const [mois, setMois] = useState(new Date().getMonth() + 1);
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [pointages, setPointages] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/chantiers').then(r => r?.success && setChantiers(r.data));
    api.get('/employes').then(r => r?.success && setEmployes(r.data));
    api.get('/affectations-chantier').then(r => r?.success && setAffectations(r.data));
  }, []);

  useEffect(() => {
    if (!chantierSel) return;
    api.get(`/pointages?chantier_id=${chantierSel}&mois=${mois}&annee=${annee}`).then(r => {
      if (!r?.success) return;
      const map = {};
      r.data.forEach(p => {
        const day = new Date(p.date_pointage).getDate();
        map[`${p.employe_id}_${day}`] = p.statut_journee;
      });
      setPointages(map);
    });
  }, [chantierSel, mois, annee]);

  const employChantiSel = affectations.filter(a => a.chantier_id === +chantierSel).map(a => a.employe);
  const daysInMonth = new Date(annee, mois, 0).getDate();

  const setPointage = (empId, day, val) => setPointages(p => ({ ...p, [`${empId}_${day}`]: val }));

  const getColor = (s) => ({ PRESENT: '#10b981', ABSENT: '#ef4444', CONGE: '#3b82f6', MALADIE: '#f59e0b', FERIE: '#6b7280', MISSION: '#8b5cf6' })[s] || '#e5e7eb';

  const save = async () => {
    setSaving(true);
    const batch = [];
    employChantiSel.forEach(emp => {
      if (!emp) return;
      for (let d = 1; d <= daysInMonth; d++) {
        const statut = pointages[`${emp.id}_${d}`];
        if (statut) {
          batch.push({ employe_id: emp.id, chantier_id: +chantierSel, date_pointage: new Date(annee, mois - 1, d).toISOString(), statut_journee: statut, heures_normales: statut === 'PRESENT' ? 8 : 0 });
        }
      }
    });
    await api.post('/pointages/batch', { pointages: batch });
    setSaving(false);
    alert('Pointage enregistré !');
  };

  const STATUTS = ['P', 'A', 'C', 'M', 'F'];
  const STATUT_MAP = { P: 'PRESENT', A: 'ABSENT', C: 'CONGE', M: 'MALADIE', F: 'FERIE' };
  const STATUT_RMAP = { PRESENT: 'P', ABSENT: 'A', CONGE: 'C', MALADIE: 'M', FERIE: 'F' };

  return (
    <div>
      <div className="card p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div>
          <label className="form-label">Chantier</label>
          <select className="form-select" value={chantierSel} onChange={e => setChantierSel(e.target.value)}>
            <option value="">— Sélectionner —</option>
            {chantiers.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Mois</label>
          <select className="form-select" value={mois} onChange={e => setMois(+e.target.value)}>
            {['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'].map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Année</label>
          <input className="form-input" type="number" value={annee} onChange={e => setAnnee(+e.target.value)} style={{ width: 90 }} />
        </div>
        <div className="pt-5">
          <div className="flex gap-2 text-xs">
            {Object.entries(STATUT_MAP).map(([k, v]) => <span key={k} className="flex items-center gap-1"><span className="w-4 h-4 rounded" style={{ background: getColor(v) }} />{k}={v.slice(0,3)}</span>)}
          </div>
        </div>
      </div>

      {!chantierSel ? (
        <div className="card p-12 text-center text-muted">Sélectionnez un chantier pour afficher la grille de pointage</div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="data-table" style={{ fontSize: 11, minWidth: 1200 }}>
            <thead>
              <tr>
                <th style={{ minWidth: 160 }}>Employé</th>
                {Array.from({ length: daysInMonth }, (_, i) => <th key={i + 1} style={{ width: 36, textAlign: 'center' }}>{i + 1}</th>)}
                <th>Total P</th>
              </tr>
            </thead>
            <tbody>
              {employChantiSel.filter(Boolean).map(emp => {
                const totalP = Array.from({ length: daysInMonth }, (_, i) => pointages[`${emp.id}_${i + 1}`] === 'PRESENT' ? 1 : 0).reduce((a, b) => a + b, 0);
                return (
                  <tr key={emp.id}>
                    <td className="font-medium" style={{ whiteSpace: 'nowrap' }}>{emp.prenom} {emp.nom}</td>
                    {Array.from({ length: daysInMonth }, (_, i) => {
                      const d = i + 1;
                      const val = pointages[`${emp.id}_${d}`] || '';
                      const shortVal = STATUT_RMAP[val] || '';
                      return (
                        <td key={d} style={{ padding: 2, textAlign: 'center' }}>
                          <select
                            value={shortVal}
                            onChange={e => setPointage(emp.id, d, STATUT_MAP[e.target.value] || '')}
                            style={{ width: 34, fontSize: 10, padding: '2px 1px', border: '1px solid #e2e8f0', borderRadius: 4, background: getColor(val), color: val ? 'white' : '#374151', cursor: 'pointer', textAlign: 'center' }}
                          >
                            <option value="">—</option>
                            {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      );
                    })}
                    <td className="font-bold text-center" style={{ color: '#10b981' }}>{totalP}j</td>
                  </tr>
                );
              })}
              {employChantiSel.length === 0 && <tr><td colSpan={daysInMonth + 2} className="text-center py-6 text-muted">Aucun employé affecté à ce chantier</td></tr>}
            </tbody>
          </table>
          {employChantiSel.length > 0 && (
            <div className="p-4 border-t flex justify-end">
              <button className="btn btn-primary" onClick={save} disabled={saving}>
                {saving ? 'Enregistrement...' : '💾 Enregistrer la grille'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── ONGLET CONGÉS ────────────────────────────────────────────────────────────
function OngletConges() {
  const [data, setData] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ employe_id: '', type_conge: 'ANNUEL', date_debut: '', date_fin: '', notes: '' });

  const load = () => {
    api.get('/conges').then(r => r?.success && setData(r.data));
    api.get('/employes').then(r => r?.success && setEmployes(r.data));
  };
  useEffect(load, []);

  const calcJours = () => {
    if (!form.date_debut || !form.date_fin) return 0;
    return Math.ceil((new Date(form.date_fin) - new Date(form.date_debut)) / 86400000) + 1;
  };

  const save = async () => {
    await api.post('/conges', { ...form, employe_id: +form.employe_id, nombre_jours: calcJours() });
    setShowModal(false); load();
  };

  const updateStatut = async (id, statut) => {
    await api.put(`/conges/${id}/statut`, { statut }); load();
  };

  const STATUT_C = { DEMANDE: 'badge-warning', ACCEPTE: 'badge-success', REFUSE: 'badge-danger' };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={15} /> Demande de congé</button>
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Employé</th><th>Type</th><th>Du</th><th>Au</th><th>Jours</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>
            {data.length === 0
              ? <tr><td colSpan={7} className="text-center py-8 text-muted">Aucun congé</td></tr>
              : data.map(c => (
                <tr key={c.id}>
                  <td className="font-medium">{c.employe?.prenom} {c.employe?.nom}</td>
                  <td><span className="badge badge-info text-xs">{c.type_conge}</span></td>
                  <td>{fmtDate(c.date_debut)}</td>
                  <td>{fmtDate(c.date_fin)}</td>
                  <td className="font-semibold">{c.nombre_jours}j</td>
                  <td><span className={`badge ${STATUT_C[c.statut] || 'badge-gray'}`}>{c.statut}</span></td>
                  <td>
                    {c.statut === 'DEMANDE' && (
                      <div className="flex gap-1">
                        <button className="btn btn-sm" style={{ background: '#10b981', color: 'white', padding: '3px 8px', fontSize: 11, borderRadius: 6 }} onClick={() => updateStatut(c.id, 'ACCEPTE')}>✓</button>
                        <button className="btn btn-sm" style={{ background: '#ef4444', color: 'white', padding: '3px 8px', fontSize: 11, borderRadius: 6 }} onClick={() => updateStatut(c.id, 'REFUSE')}>✗</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-content" style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <span className="modal-title">Demande de congé</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="space-y-3">
                <div>
                  <label className="form-label">Employé *</label>
                  <select className="form-select" value={form.employe_id} onChange={e => setForm(f => ({ ...f, employe_id: e.target.value }))}>
                    <option value="">—</option>{employes.map(e => <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Type de congé</label>
                  <select className="form-select" value={form.type_conge} onChange={e => setForm(f => ({ ...f, type_conge: e.target.value }))}>
                    {TYPE_CONGE.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="form-label">Date début</label><input className="form-input" type="date" value={form.date_debut} onChange={e => setForm(f => ({ ...f, date_debut: e.target.value }))} /></div>
                  <div><label className="form-label">Date fin</label><input className="form-input" type="date" value={form.date_fin} onChange={e => setForm(f => ({ ...f, date_fin: e.target.value }))} /></div>
                </div>
                {form.date_debut && form.date_fin && <p className="text-sm text-orange font-semibold">= {calcJours()} jour(s)</p>}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={save}>Soumettre</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const TABS = [
  { id: 'employes', label: 'Employés', icon: Users },
  { id: 'pointage', label: 'Pointage', icon: Calendar },
  { id: 'conges', label: 'Congés', icon: Clock },
];

export default function RH() {
  const [tab, setTab] = useState('employes');
  return (
    <div className="p-6 md:p-8 animate-slide-up">
      <div className="page-header">
        <div><h1 className="page-title">Ressources Humaines</h1><p className="page-subtitle">Employés, pointage et congés</p></div>
      </div>
      <div className="tabs-container">
        {TABS.map(t => <button key={t.id} className={`tab-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}><t.icon size={14} /> {t.label}</button>)}
      </div>
      {tab === 'employes' && <OngletEmployes />}
      {tab === 'pointage' && <OngletPointage />}
      {tab === 'conges' && <OngletConges />}
    </div>
  );
}
