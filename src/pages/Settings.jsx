import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Building, Users, X } from 'lucide-react';
import { api } from '../utils/api';

function OngletEntreprise() {
  const [form, setForm] = useState({ nom: '', rc: '', nif: '', nis: '', art: '', adresse: '', telephone: '', email: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/settings/company').then(r => r?.success && setForm(r.data || {}));
  }, []);

  const save = async () => {
    await api.put('/settings/company', form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="card p-6 max-w-2xl">
      <h3 className="font-semibold text-gray-800 mb-4">Informations de l'entreprise</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><label className="form-label">Raison sociale *</label><input className="form-input" value={form.nom || ''} onChange={e => set('nom', e.target.value)} /></div>
        <div><label className="form-label">N° RC</label><input className="form-input" value={form.rc || ''} onChange={e => set('rc', e.target.value)} /></div>
        <div><label className="form-label">NIF</label><input className="form-input" value={form.nif || ''} onChange={e => set('nif', e.target.value)} /></div>
        <div><label className="form-label">NIS</label><input className="form-input" value={form.nis || ''} onChange={e => set('nis', e.target.value)} /></div>
        <div><label className="form-label">Article</label><input className="form-input" value={form.art || ''} onChange={e => set('art', e.target.value)} /></div>
        <div><label className="form-label">Téléphone</label><input className="form-input" value={form.telephone || ''} onChange={e => set('telephone', e.target.value)} /></div>
        <div><label className="form-label">Email</label><input className="form-input" type="email" value={form.email || ''} onChange={e => set('email', e.target.value)} /></div>
        <div className="col-span-2"><label className="form-label">Adresse</label><textarea className="form-input" rows={2} value={form.adresse || ''} onChange={e => set('adresse', e.target.value)} /></div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button className="btn btn-primary" onClick={save}>Enregistrer</button>
        {saved && <span className="text-success text-sm font-semibold">✅ Enregistré !</span>}
      </div>
    </div>
  );
}

function OngletUtilisateurs() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', password: '', role: 'READONLY' });

  const load = () => api.get('/auth/users').then(r => r?.success && setData(r.data));
  useEffect(load, []);

  const save = async () => {
    await api.post('/auth/register', form);
    setShowModal(false); setForm({ nom: '', prenom: '', email: '', password: '', role: 'READONLY' }); load();
  };

  const toggle = async (u) => {
    await api.put(`/auth/users/${u.id}`, { ...u, actif: !u.actif }); load();
  };

  const ROLES = ['SUPER_ADMIN', 'DIRECTEUR', 'CONDUCTEUR_TRAVAUX', 'COMPTABLE', 'POINTEUR', 'READONLY'];
  const ROLE_COLORS = { SUPER_ADMIN: 'badge-danger', DIRECTEUR: 'badge-orange', CONDUCTEUR_TRAVAUX: 'badge-info', COMPTABLE: 'badge-warning', POINTEUR: 'badge-info', READONLY: 'badge-gray' };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><span>+</span> Nouvel utilisateur</button>
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Nom</th><th>Email</th><th>Rôle</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>
            {data.map(u => (
              <tr key={u.id}>
                <td className="font-semibold">{u.prenom} {u.nom}</td>
                <td className="font-mono text-sm text-muted">{u.email}</td>
                <td><span className={`badge ${ROLE_COLORS[u.role] || 'badge-gray'}`}>{u.role}</span></td>
                <td>
                  <button onClick={() => toggle(u)} className={`badge ${u.actif ? 'badge-success' : 'badge-danger'}`} style={{ cursor: 'pointer', border: 'none' }}>
                    {u.actif ? '● Actif' : '○ Inactif'}
                  </button>
                </td>
                <td className="text-muted text-xs">ID #{u.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-content" style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <span className="modal-title">Nouvel utilisateur</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="form-label">Nom *</label><input className="form-input" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} /></div>
                <div><label className="form-label">Prénom *</label><input className="form-input" value={form.prenom} onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))} /></div>
                <div className="col-span-2"><label className="form-label">Email *</label><input className="form-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
                <div className="col-span-2"><label className="form-label">Mot de passe *</label><input className="form-input" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} /></div>
                <div className="col-span-2">
                  <label className="form-label">Rôle</label>
                  <select className="form-select" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={save}>Créer le compte</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function OngletFiscal() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="card p-5">
        <h3 className="font-semibold text-gray-800 mb-3">Cotisations sociales (CNAS)</h3>
        <div className="space-y-2 text-sm">
          {[
            { label: 'CNAS employé (taux)', value: '9%', color: '#E07B2A' },
            { label: 'CNAS patronal (taux)', value: '26%', color: '#1B3A5C' },
            { label: 'Total CNAS (employeur)', value: '35%', color: '#ef4444' },
          ].map((r, i) => (
            <div key={i} className="flex justify-between items-center p-3 rounded-lg" style={{ background: '#f8fafc' }}>
              <span className="text-gray-600">{r.label}</span>
              <span className="font-bold text-base" style={{ color: r.color }}>{r.value}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-3">Source : Décret exécutif n° 96-209 du 5 juin 1996 (modifié)</p>
      </div>
      <div className="card p-5">
        <h3 className="font-semibold text-gray-800 mb-3">Barème IRG Algérie 2024 (mensuel)</h3>
        <table className="data-table">
          <thead><tr><th>Tranche (DA)</th><th>Taux</th></tr></thead>
          <tbody>
            {[
              ['0 — 10 000', '0%'],
              ['10 001 — 30 000', '20%'],
              ['30 001 — 120 000', '30%'],
              ['> 120 000', '35%'],
            ].map(([t, r], i) => (
              <tr key={i}><td className="font-mono text-sm">{t}</td><td className="font-bold text-orange">{r}</td></tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-muted mt-2">Abattement : 40% du revenu imposable (max 2 000 DA/mois)<br />Base imposable = Brut – CNAS(9%) – Abattement</p>
      </div>
      <div className="card p-5">
        <h3 className="font-semibold text-gray-800 mb-3">TVA Algérie</h3>
        <div className="space-y-2 text-sm">
          {[
            { label: 'Taux réduit', value: '9%', desc: 'Certains matériaux de construction' },
            { label: 'Taux normal', value: '19%', desc: 'Taux général applicable' },
            { label: 'Exonéré', value: '0%', desc: 'Logements et certains travaux' },
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: '#f8fafc' }}>
              <span className="font-bold text-base w-10 text-orange">{t.value}</span>
              <div><p className="font-semibold">{t.label}</p><p className="text-xs text-muted">{t.desc}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'company', label: 'Entreprise', icon: Building },
  { id: 'users', label: 'Utilisateurs', icon: Users },
  { id: 'fiscal', label: 'Paramètres fiscaux DZ', icon: SettingsIcon },
];

export default function Settings() {
  const [tab, setTab] = useState('company');
  return (
    <div className="p-6 md:p-8 animate-slide-up">
      <div className="page-header">
        <div><h1 className="page-title">Paramètres</h1><p className="page-subtitle">Configuration entreprise et utilisateurs</p></div>
      </div>
      <div className="tabs-container">
        {TABS.map(t => <button key={t.id} className={`tab-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}><t.icon size={14} /> {t.label}</button>)}
      </div>
      {tab === 'company' && <OngletEntreprise />}
      {tab === 'users' && <OngletUtilisateurs />}
      {tab === 'fiscal' && <OngletFiscal />}
    </div>
  );
}
