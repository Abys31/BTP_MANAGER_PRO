import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, DollarSign, FileText } from 'lucide-react';
import { api } from '../utils/api';

const fmt = (v) => new Intl.NumberFormat('fr-DZ').format(Math.round(v || 0)) + ' DA';
const STATUT = { BROUILLON: 'badge-gray', VALIDE: 'badge-info', PAYE: 'badge-success' };

export default function Paie() {
  const [bulletins, setBulletins] = useState([]);
  const [mois, setMois] = useState(new Date().getMonth() + 1);
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const load = () => {
    setLoading(true);
    api.get(`/bulletins-paie?mois=${mois}&annee=${annee}`).then(r => {
      if (r?.success) setBulletins(r.data);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, [mois, annee]);

  const generer = async () => {
    setGenerating(true);
    await api.post('/bulletins-paie/generer-mois', { mois, annee });
    setGenerating(false);
    load();
  };

  const valider = async (id) => {
    await api.put(`/bulletins-paie/${id}/valider`); load();
  };

  const payer = async (id) => {
    await api.put(`/bulletins-paie/${id}/payer`); load();
  };

  const totalNet = bulletins.reduce((s, b) => s + b.salaire_net, 0);
  const totalBrut = bulletins.reduce((s, b) => s + b.salaire_brut, 0);
  const totalCNAS = bulletins.reduce((s, b) => s + b.retenues_cnas, 0);
  const totalIRG = bulletins.reduce((s, b) => s + b.retenues_irg, 0);

  const MOIS_NOM = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

  return (
    <div className="p-6 md:p-8 animate-slide-up">
      <div className="page-header">
        <div><h1 className="page-title">Paie & Bulletins</h1><p className="page-subtitle">Calculs IRG/CNAS conformes barème DZ 2024</p></div>
        <button className="btn btn-primary" onClick={generer} disabled={generating}>
          <CreditCard size={15} /> {generating ? 'Génération...' : 'Générer les bulletins du mois'}
        </button>
      </div>

      {/* Sélecteurs */}
      <div className="card p-4 mb-5 flex gap-4 items-center">
        <div>
          <label className="form-label">Mois</label>
          <select className="form-select" value={mois} onChange={e => setMois(+e.target.value)}>
            {MOIS_NOM.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Année</label>
          <input className="form-input" type="number" value={annee} onChange={e => setAnnee(+e.target.value)} style={{ width: 90 }} />
        </div>
        <div className="text-sm text-muted pt-5">
          Période : <strong>{MOIS_NOM[mois - 1]} {annee}</strong> — {bulletins.length} bulletin(s)
        </div>
      </div>

      {/* KPIs */}
      {bulletins.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {[
            { label: 'Masse salariale brute', value: fmt(totalBrut), color: '#1B3A5C' },
            { label: 'CNAS employés (9%)', value: fmt(totalCNAS), color: '#e07b2a' },
            { label: 'IRG total', value: fmt(totalIRG), color: '#f59e0b' },
            { label: 'Net à payer', value: fmt(totalNet), color: '#10b981' },
          ].map((k, i) => (
            <div key={i} className="stat-card">
              <p className="stat-card-label">{k.label}</p>
              <p className="stat-card-value" style={{ color: k.color, fontSize: 18 }}>{k.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Table bulletins */}
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Employé</th>
              <th>Jours</th>
              <th>Salaire brut</th>
              <th>CNAS (9%)</th>
              <th>IRG</th>
              <th>Avances</th>
              <th>Net à payer</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <tr><td colSpan={9} className="text-center py-8 text-muted">Chargement...</td></tr>
              : bulletins.length === 0
                ? <tr><td colSpan={9} className="text-center py-8 text-muted">
                    <div>
                      <p className="mb-2">Aucun bulletin pour {MOIS_NOM[mois - 1]} {annee}</p>
                      <button className="btn btn-primary btn-sm" onClick={generer}>Générer maintenant</button>
                    </div>
                  </td></tr>
                : bulletins.map(b => (
                  <tr key={b.id}>
                    <td>
                      <div className="font-semibold text-sm">{b.employe?.prenom} {b.employe?.nom}</div>
                      <div className="text-xs text-muted">{b.employe?.matricule}</div>
                    </td>
                    <td className="text-center font-semibold">{b.jours_travailles}j</td>
                    <td>{fmt(b.salaire_brut)}</td>
                    <td className="text-orange">{fmt(b.retenues_cnas)}</td>
                    <td className="text-warning">{fmt(b.retenues_irg)}</td>
                    <td className="text-danger">{b.avances_deduites > 0 ? fmt(b.avances_deduites) : '—'}</td>
                    <td className="font-bold text-success text-base">{fmt(b.salaire_net)}</td>
                    <td><span className={`badge ${STATUT[b.statut] || 'badge-gray'}`}>{b.statut}</span></td>
                    <td>
                      <div className="flex gap-1">
                        {b.statut === 'BROUILLON' && (
                          <button className="btn btn-sm" style={{ background: '#1B3A5C', color: 'white', padding: '3px 8px', fontSize: 11, borderRadius: 6 }} onClick={() => valider(b.id)}>Valider</button>
                        )}
                        {b.statut === 'VALIDE' && (
                          <button className="btn btn-sm" style={{ background: '#10b981', color: 'white', padding: '3px 8px', fontSize: 11, borderRadius: 6 }} onClick={() => payer(b.id)}>Marquer payé</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        {/* Récapitulatif CNAS patronal */}
        {bulletins.length > 0 && (
          <div className="p-4 bg-blue-50 border-t border-blue-100">
            <p className="text-sm font-semibold text-blue-800 mb-2">📋 Récapitulatif cotisations sociales — {MOIS_NOM[mois - 1]} {annee}</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div><span className="text-muted">CNAS employés (9%) :</span> <strong>{fmt(totalCNAS)}</strong></div>
              <div><span className="text-muted">CNAS patronal (26%) :</span> <strong>{fmt(totalBrut * 0.26)}</strong></div>
              <div><span className="text-muted">Total CNAS à verser :</span> <strong className="text-blue-700">{fmt(totalCNAS + totalBrut * 0.26)}</strong></div>
            </div>
          </div>
        )}
      </div>

      {/* Info barème */}
      <div className="card p-4 mt-4" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
        <p className="text-xs font-semibold text-green-700 mb-1">ℹ️ Barème IRG Algérie 2024 appliqué</p>
        <p className="text-xs text-green-600">Base imposable = Brut − CNAS(9%) − Abattement(40%, max 2 000 DA) | Tranche 1 : 0 à 10 000 DA = 0% | Tranche 2 : 10 001 à 30 000 DA = 20% | Tranche 3 : 30 001 à 120 000 DA = 30% | Tranche 4 : &gt; 120 000 DA = 35%</p>
      </div>
    </div>
  );
}
