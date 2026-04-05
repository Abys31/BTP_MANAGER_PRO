import React, { useState } from 'react'
import { Calculator, Plus, Trash2, Download, CheckCircle2, AlertCircle } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const ChantierMode = () => {
  const [metrics, setMetrics] = useState([
    { id: 1, article: '1.01', libelle: 'Terrassement en masse', formule: '15*12*1.5', resultat: 270, unite: 'M3', qteMarche: 300 },
    { id: 2, article: '2.04', libelle: 'Béton armé pour semelles', formule: '(4*1.2*1.2*0.6)*8', resultat: 6.912, unite: 'M3', qteMarche: 10.0 },
  ])

  const calculate = (formule) => {
    try {
      // Basic math parser
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

  const generatePDF = () => {
    const doc = new jsPDF()
    const date = new Date().toLocaleDateString('fr-DZ')
    
    // Header
    doc.setFontSize(10)
    doc.text("RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE", 105, 15, { align: 'center' })
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("ATLAS MANAGER - FEUILLE D'ATTACHEMENT", 105, 25, { align: 'center' })
    
    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text(`Projet: Construction d'un Groupe Scolaire`, 14, 40)
    doc.text(`Entreprise: ATLAS CONSTRUCTION DZ`, 14, 46)
    doc.text(`Date: ${date}`, 14, 52)
    doc.text(`Attachement N°: 01`, 160, 52)

    // Table
    const tableData = metrics.map(m => [
      m.article,
      m.libelle,
      m.unite,
      m.formule,
      m.resultat.toFixed(3)
    ])

    autoTable(doc, {
      startY: 60,
      head: [['Article', 'Désignation des Travaux', 'Unité', 'Détail des calculs (Formule)', 'Quantité']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillStyle: '#1e293b', textColor: [255, 255, 255] },
      columnStyles: {
        4: { halign: 'right', fontStyle: 'bold' }
      }
    })

    // Footer
    const finalY = doc.lastAutoTable.finalY + 20
    doc.text("L'Entreprise", 30, finalY)
    doc.text("Le Maître d'Œuvre", 90, finalY)
    doc.text("Le Maître d'Ouvrage", 150, finalY)

    doc.save(`Attachement_01_${date.replace(/\//g, '-')}.pdf`)
  }

  const addMetric = () => {
    setMetrics([...metrics, { 
      id: Date.now(), 
      article: '', 
      libelle: 'Nouvel article...', 
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
          <span>Chantiers</span> / <span>Situations</span> / <span>Métrés</span>
        </div>
        <div className="header-main">
          <div className="title-section">
            <h1>Attachement N° 01</h1>
            <span className="status-badge">Brouillon</span>
          </div>
          <div className="header-actions">
            <button className="btn-outline" onClick={generatePDF}><Download size={18} /> Exporter PDF</button>
            <button className="btn-primary" onClick={() => alert("Validation de l'attachement envoyée au Maître d'Œuvre !")}><CheckCircle2 size={18} /> Valider l'attachement</button>
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
