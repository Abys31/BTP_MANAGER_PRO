import React, { useState } from 'react'
import { Calculator, Plus, Trash2, Download, CheckCircle2, AlertCircle } from 'lucide-react'

const ChantierMode = () => {
  const [metrics, setMetrics] = useState([
    { id: 1, article: '1.03 - hgfg', libelle: 'revêtement de surface', formule: '10*5', resultat: 50.5, unite: 'M2', qteMarche: 1.0 },
  ])

  const calculate = (formule) => {
    try {
      // Basic math parser (safeeval would be better in prod)
      return eval(formule.replace(/[^-()\d/*+.]/g, '')) || 0
    } catch {
      return 0
    }
  }

  const handleFormuleChange = (id, val) => {
    setMetrics(prev => prev.map(m => {
      if (m.id === id) {
        const res = calculate(val)
        return { ...m, formule: val, resultat: res }
      }
      return m
    }))
  }

  const addMetric = () => {
    setMetrics([...metrics, { 
      id: Date.now(), 
      article: '', 
      libelle: 'Description du métré...', 
      formule: '', 
      resultat: 0, 
      unite: 'U', 
      qteMarche: 0 
    }])
  }

  const totalGeneral = metrics.reduce((acc, m) => acc + m.resultat, 0)

  return (
    <div className="chantier-mode">
      <div className="attachment-header">
        <div className="breadcrumb">
          <span>Chantiers</span> / <span>Situations de travaux</span> / <span>Feuille d'attachement</span>
        </div>
        <div className="header-main">
          <div className="title-section">
            <h1>Attachement N° 1</h1>
            <span className="status-badge">Modifiable</span>
          </div>
          <div className="header-actions">
            <button className="btn-outline"><Download size={18} /> Exporter PDF</button>
            <button className="btn-primary"><CheckCircle2 size={18} /> Valider</button>
          </div>
        </div>
      </div>

      <div className="attachment-card">
        <div className="card-header">
          <h3>Lignes d'attachement</h3>
          <p>Détail des métrés et calculs de quantités</p>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Article DQE</th>
                <th>Libellé</th>
                <th>Formule</th>
                <th>Résultat</th>
                <th width="50"></th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m) => (
                <React.Fragment key={m.id}>
                  <tr className="metric-row">
                    <td><input value={m.article} onChange={(e) => {}} placeholder="Article..." /></td>
                    <td><input value={m.libelle} onChange={(e) => {}} /></td>
                    <td><input className="font-mono" value={m.formule} onChange={(e) => handleFormuleChange(m.id, e.target.value)} placeholder="10 * 5" /></td>
                    <td className="result-cell">{m.resultat.toFixed(3)}</td>
                    <td><button className="delete-btn"><Trash2 size={16} /></button></td>
                  </tr>
                  {m.resultat > m.qteMarche && (
                    <tr className="warning-row animate-fade-in">
                      <td colSpan="5">
                        <div className="warning-alert">
                          <AlertCircle size={16} />
                          <span>Dépassement de {(m.resultat - m.qteMarche).toFixed(3)} U ({Math.round(((m.resultat/m.qteMarche)-1)*100)}% au-dessus du marché). Cette quantité excédentaire nécessite une régularisation par avenant.</span>
                          <button className="text-link">Demander un avenant</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <button className="add-row-btn" onClick={addMetric}>
          <Plus size={18} />
          <span>Ajouter une ligne</span>
        </button>

        <div className="totals-section">
          <div className="total-row main">
            <span>Total général</span>
            <span className="total-value">{totalGeneral.toFixed(3)}</span>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .chantier-mode { max-width: 1100px; margin: 0 auto; color: var(--text-main); }
        
        .breadcrumb { font-size: 12px; color: var(--text-muted); margin-bottom: 8px; }
        .header-main { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .title-section { display: flex; align-items: center; gap: 16px; }
        .status-badge { background: var(--bg-hover); color: var(--text-secondary); padding: 4px 10px; border-radius: 4px; font-size: 12px; }
        
        .attachment-card { background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border); overflow: hidden; }
        .card-header { padding: 24px; border-bottom: 1px solid var(--border); }
        .card-header h3 { font-size: 18px; margin-bottom: 4px; }
        .card-header p { font-size: 13px; color: var(--text-muted); }

        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 16px 24px; font-size: 13px; color: var(--text-secondary); border-bottom: 1px solid var(--border); }
        td { padding: 12px 24px; border-bottom: 1px solid var(--border); }

        input { background: var(--bg-sidebar); border: 1px solid var(--border-strong); color: var(--text-main); padding: 8px 12px; border-radius: 6px; width: 100%; outline: none; }
        input:focus { border-color: var(--primary); }
        
        .font-mono { font-family: 'Courier New', Courier, monospace; }
        .result-cell { font-weight: 600; text-align: right; }
        
        .warning-alert { display: flex; align-items: center; gap: 12px; background: rgba(239, 68, 68, 0.1); color: var(--error); padding: 12px 16px; border-radius: 8px; border: 1px solid rgba(239, 68, 68, 0.2); font-size: 13px; }
        .text-link { color: var(--primary); text-decoration: underline; margin-left: auto; font-size: 12px; }

        .add-row-btn { display: flex; align-items: center; gap: 8px; padding: 12px 24px; color: var(--text-secondary); width: 100%; transition: var(--transition); }
        .add-row-btn:hover { background: var(--bg-hover); color: var(--primary); }

        .totals-section { padding: 24px; background: var(--bg-sidebar); }
        .total-row { display: flex; justify-content: space-between; align-items: center; }
        .total-row.main { font-size: 18px; font-weight: 700; }
        .total-value { color: var(--primary); }

        .btn-primary { background: var(--primary); color: white; padding: 10px 20px; border-radius: 8px; display: flex; align-items: center; gap: 8px; font-weight: 500; }
        .btn-outline { border: 1px solid var(--border-strong); color: var(--text-secondary); padding: 10px 20px; border-radius: 8px; display: flex; align-items: center; gap: 8px; }
      `}</style>
    </div>
  )
}

export default ChantierMode
