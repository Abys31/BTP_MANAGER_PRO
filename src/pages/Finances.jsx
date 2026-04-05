import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Wallet, Receipt } from 'lucide-react';
import { api } from '../utils/api';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const fmt = (v) => new Intl.NumberFormat('fr-DZ').format(Math.round(v || 0)) + ' DA';

function OngletCompteResultat() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/reporting/compte-resultat').then(r => {
      if (r?.success) setData(r.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="card p-12 text-center text-muted">Calcul en cours...</div>;
  if (!data) return <div className="card p-8 text-center text-muted">Impossible de charger les données</div>;

  const totalCharges = Object.values(data.charges).reduce((s, v) => s + v, 0);
  const marge = data.produits.encaissements > 0
    ? ((data.produits.encaissements - totalCharges) / data.produits.encaissements * 100).toFixed(1)
    : 0;

  const Row = ({ label, value, bold, indent, color }) => (
    <div className={`flex items-center justify-between py-2 border-b border-gray-50 ${indent ? 'pl-6' : ''}`}>
      <span className={`text-sm ${bold ? 'font-bold text-gray-800' : 'text-gray-600'}`}>{label}</span>
      <span className={`font-semibold text-sm ${bold ? 'text-base' : ''}`} style={{ color: color || '#1e293b' }}>{fmt(value)}</span>
    </div>
  );

  return (
    <div className="card p-6">
      <h3 className="font-bold text-gray-800 mb-4 text-base">📊 Compte de résultat — Données réelles (base)</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="p-3 rounded-lg mb-3" style={{ background: '#f0fdf4' }}>
            <h4 className="font-semibold text-green-700 text-sm mb-2">PRODUITS</h4>
            <Row label="Encaissements clients" value={data.produits.encaissements} indent />
            <Row label="TOTAL PRODUITS" value={data.produits.encaissements} bold color="#10b981" />
          </div>
          <div className="p-3 rounded-lg" style={{ background: '#fff1f2' }}>
            <h4 className="font-semibold text-red-700 text-sm mb-2">CHARGES</h4>
            <Row label="Achats matériaux (factures payées)" value={data.charges.achats} indent />
            <Row label="Masse salariale (bulletins payés)" value={data.charges.paie} indent />
            <Row label="Dépenses directes" value={data.charges.depenses} indent />
            <Row label="TOTAL CHARGES" value={totalCharges} bold color="#ef4444" />
          </div>
        </div>
        <div>
          <div className="p-6 rounded-xl text-center" style={{ background: data.resultat >= 0 ? '#f0fdf4' : '#fff1f2' }}>
            <p className="text-sm font-semibold text-gray-500 mb-2">RÉSULTAT BRUT</p>
            <p className="text-4xl font-bold mb-2" style={{ color: data.resultat >= 0 ? '#10b981' : '#ef4444' }}>
              {fmt(data.resultat)}
            </p>
            <div className="text-2xl font-bold" style={{ color: data.marge_pct >= 0 ? '#10b981' : '#ef4444' }}>
              Marge : {data.marge_pct}%
            </div>
          </div>
          <div className="mt-4 p-4 rounded-lg" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <p className="text-xs text-muted mb-2 font-semibold">Répartition des charges</p>
            <div className="space-y-2">
              {[
                { label: 'Matériaux', val: data.charges.achats, color: '#E07B2A' },
                { label: 'Masse salariale', val: data.charges.paie, color: '#1B3A5C' },
                { label: 'Dépenses directes', val: data.charges.depenses, color: '#10b981' },
              ].map((c, i) => {
                const pct = totalCharges > 0 ? (c.val / totalCharges * 100).toFixed(0) : 0;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1"><span>{c.label}</span><span className="font-semibold">{pct}%</span></div>
                    <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${pct}%`, background: c.color }} /></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OngletBudget() {
  const [chantiers, setChantiers] = useState([]);
  const [sel, setSel] = useState('');
  const [budget, setBudget] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [lignes, setLignes] = useState([{ categorie: 'MATERIAUX', description: '', montant_prevu: '' }]);

  useEffect(() => {
    api.get('/chantiers').then(r => r?.success && setChantiers(r.data));
  }, []);

  useEffect(() => {
    if (!sel) return;
    api.get(`/budget-chantier/${sel}`).then(r => {
      setBudget(r?.success ? r.data : null);
    });
  }, [sel]);

  const creerBudget = async () => {
    await api.post('/budget-chantier', {
      chantier_id: +sel, statut: 'VALIDE',
      lignes: lignes.filter(l => l.description && l.montant_prevu).map(l => ({ ...l, montant_prevu: +l.montant_prevu }))
    });
    setShowCreate(false);
    api.get(`/budget-chantier/${sel}`).then(r => r?.success && setBudget(r.data));
  };

  const CATS = ['MATERIAUX', 'MAIN_OEUVRE', 'SOUS_TRAITANCE', 'MATERIEL', 'FRAIS_GENERAUX'];

  const totalPrevu = budget?.lignes?.reduce((s, l) => s + l.montant_prevu, 0) || 0;
  const totalRealise = budget?.lignes?.reduce((s, l) => s + l.montant_realise, 0) || 0;

  return (
    <div>
      <div className="card p-4 mb-4 flex gap-4 items-end">
        <div className="flex-1">
          <label className="form-label">Chantier</label>
          <select className="form-select" value={sel} onChange={e => setSel(e.target.value)}>
            <option value="">— Sélectionner —</option>
            {chantiers.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>
        </div>
        {sel && !budget && (
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>Créer le budget</button>
        )}
      </div>

      {!sel && <div className="card p-12 text-center text-muted">Sélectionnez un chantier</div>}

      {sel && !budget && !showCreate && (
        <div className="card p-12 text-center">
          <p className="text-muted mb-3">Aucun budget pour ce chantier</p>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>Créer le budget</button>
        </div>
      )}

      {showCreate && (
        <div className="card p-5 mb-4">
          <h4 className="font-semibold mb-3">Créer le budget</h4>
          {lignes.map((l, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <select className="form-select" style={{ width: 180 }} value={l.categorie} onChange={e => setLignes(ls => ls.map((x, j) => j === i ? { ...x, categorie: e.target.value } : x))}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
              <input className="form-input flex-1" placeholder="Description" value={l.description} onChange={e => setLignes(ls => ls.map((x, j) => j === i ? { ...x, description: e.target.value } : x))} />
              <input className="form-input" style={{ width: 140 }} type="number" placeholder="Montant prévu" value={l.montant_prevu} onChange={e => setLignes(ls => ls.map((x, j) => j === i ? { ...x, montant_prevu: e.target.value } : x))} />
            </div>
          ))}
          <button className="btn btn-secondary btn-sm mt-2 mr-2" onClick={() => setLignes(l => [...l, { categorie: 'MATERIAUX', description: '', montant_prevu: '' }])}>+ Ligne</button>
          <button className="btn btn-primary btn-sm mt-2" onClick={creerBudget}>Enregistrer le budget</button>
        </div>
      )}

      {budget && (
        <div className="card">
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">Budget v{budget.version} — {budget.statut}</h3>
              <p className="text-xs text-muted">{budget.lignes?.length} ligne(s)</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted">Prévu</p>
              <p className="font-bold text-orange">{fmt(totalPrevu)}</p>
            </div>
          </div>
          <table className="data-table">
            <thead><tr><th>Catégorie</th><th>Description</th><th>Prévu</th><th>Réalisé</th><th>Écart</th><th>%</th></tr></thead>
            <tbody>
              {budget.lignes?.map((l, i) => {
                const ecart = l.montant_realise - l.montant_prevu;
                const pct = l.montant_prevu > 0 ? (l.montant_realise / l.montant_prevu * 100).toFixed(0) : 0;
                return (
                  <tr key={i}>
                    <td><span className="badge badge-info text-xs">{l.categorie}</span></td>
                    <td className="text-sm">{l.description}</td>
                    <td>{fmt(l.montant_prevu)}</td>
                    <td>{fmt(l.montant_realise)}</td>
                    <td className={ecart > 0 ? 'text-danger font-semibold' : 'text-success font-semibold'}>{ecart > 0 ? '+' : ''}{fmt(ecart)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="progress-bar-track" style={{ width: 80, height: 6 }}>
                          <div className="progress-bar-fill" style={{ width: `${Math.min(pct, 100)}%`, background: pct > 100 ? '#ef4444' : '#E07B2A' }} />
                        </div>
                        <span className="text-xs font-bold" style={{ color: pct > 100 ? '#ef4444' : '#64748b' }}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="p-4 bg-gray-50 flex justify-end gap-8 text-sm">
            <span>Total prévu : <strong>{fmt(totalPrevu)}</strong></span>
            <span>Total réalisé : <strong>{fmt(totalRealise)}</strong></span>
            <span className={`font-bold ${totalRealise > totalPrevu ? 'text-danger' : 'text-success'}`}>
              Écart : {fmt(totalRealise - totalPrevu)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

const TABS = [
  { id: 'resultat', label: 'Compte de résultat', icon: BarChart3 },
  { id: 'budget', label: 'Budget chantier', icon: Wallet },
];

export default function Finances() {
  const [tab, setTab] = useState('resultat');
  return (
    <div className="p-6 md:p-8 animate-slide-up">
      <div className="page-header">
        <div><h1 className="page-title">Finances & Budget</h1><p className="page-subtitle">Compte de résultat et suivi budgétaire</p></div>
      </div>
      <div className="tabs-container">
        {TABS.map(t => <button key={t.id} className={`tab-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}><t.icon size={14} /> {t.label}</button>)}
      </div>
      {tab === 'resultat' && <OngletCompteResultat />}
      {tab === 'budget' && <OngletBudget />}
    </div>
  );
}
