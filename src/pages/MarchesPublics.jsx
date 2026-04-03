import React, { useState } from 'react'
import { wilayas } from '../data/wilayas'
import { Save, FileText, Landmark, Wallet, AlertTriangle } from 'lucide-react'

const MarchesPublics = () => {
  const [formData, setFormData] = useState({
    maitreOuvrage: '',
    operation: '',
    numeroOperation: '',
    wilaya: '16',
    type: 'marché',
    numeroMarché: '',
    dateMarché: '',
    objet: '',
    visaCF: '',
    dateVisaCF: '',
    valeurHT: '',
    tva: '19',
    retenueGarantie: true,
    cautionBonneExecution: false
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="marche-public-page">
      <div className="page-header">
        <h1>Nouveau Marché Public</h1>
        <div className="header-actions">
          <button className="btn-secondary">Annuler</button>
          <button className="btn-primary">
            <Save size={18} />
            <span>Enregistrer</span>
          </button>
        </div>
      </div>

      <div className="form-grid">
        {/* Section 1: Informations Générales */}
        <section className="form-section">
          <div className="section-header">
            <Landmark size={20} className="section-icon" />
            <h3>Informations Générales</h3>
          </div>
          
          <div className="form-group-row">
            <div className="form-group">
              <label>Maître d'Ouvrage</label>
              <input name="maitreOuvrage" value={formData.maitreOuvrage} onChange={handleChange} placeholder="Ex: Direction des Equipements Publics" />
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group flex-2">
              <label>Intitulé de l'opération</label>
              <input name="operation" value={formData.operation} onChange={handleChange} placeholder="Ex: Fondation Immeuble R+5" />
            </div>
            <div className="form-group flex-1">
              <label>Wilaya</label>
              <select name="wilaya" value={formData.wilaya} onChange={handleChange}>
                {wilayas.map(w => (
                  <option key={w.id} value={w.id}>{w.id} - {w.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label>Numéro de l'opération</label>
              <input name="numeroOperation" value={formData.numeroOperation} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Type de contrat</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="marché">Marché</option>
                <option value="convention">Convention</option>
                <option value="contrat_etude">Contrât d'étude</option>
                <option value="contrat_suivi">Contrât de suivi</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section 2: Détails Réglementaires */}
        <section className="form-section">
          <div className="section-header">
            <FileText size={20} className="section-icon" />
            <h3>Détails Réglementaires</h3>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label>Numéro du Marché</label>
              <input name="numeroMarché" value={formData.numeroMarché} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Date du Marché</label>
              <input type="date" name="dateMarché" value={formData.dateMarché} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Objet du marché</label>
            <textarea name="objet" value={formData.objet} onChange={handleChange} rows="3"></textarea>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label>Visa Réglementaire du CF (Numéro)</label>
              <input name="visaCF" value={formData.visaCF} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Date du Visa CF</label>
              <input type="date" name="dateVisaCF" value={formData.dateVisaCF} onChange={handleChange} />
            </div>
          </div>
        </section>

        {/* Section 3: Paramètres Financiers */}
        <section className="form-section">
          <div className="section-header">
            <Wallet size={20} className="section-icon" />
            <h3>Paramètres Financiers</h3>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label>ValeurHT du Marché (DZD)</label>
              <input type="number" name="valeurHT" value={formData.valeurHT} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Taux de TVA appliqué</label>
              <select name="tva" value={formData.tva} onChange={handleChange}>
                <option value="19">19% (Standard)</option>
                <option value="9">9% (Réduit - Articles Energétiques/Recyclage)</option>
                <option value="0">0% (Exonéré)</option>
              </select>
            </div>
          </div>

          <div className="guarantee-section">
            <div className="checkbox-group">
              <input type="checkbox" id="retenueGarantie" name="retenueGarantie" checked={formData.retenueGarantie} onChange={handleChange} />
              <label htmlFor="retenueGarantie">Retenue de garantie (5%)</label>
            </div>
            {!formData.retenueGarantie && (
              <div className="checkbox-group warning animate-fade-in">
                <AlertTriangle size={16} color="var(--warning)" />
                <input type="checkbox" id="cautionBonneExecution" name="cautionBonneExecution" checked={formData.cautionBonneExecution} onChange={handleChange} />
                <label htmlFor="cautionBonneExecution">Caution de bonne exécution requise</label>
              </div>
            )}
          </div>
        </section>
      </div>

      <style jsx="true">{`
        .marche-public-page {
          max-width: 1000px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .page-header h1 {
          font-size: 24px;
          font-weight: 700;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .btn-primary {
          background-color: var(--primary);
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        }

        .btn-secondary {
          border: 1px solid var(--border-strong);
          color: var(--text-secondary);
          padding: 8px 16px;
          border-radius: 6px;
        }

        .form-grid {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-section {
          background-color: var(--bg-card);
          padding: 24px;
          border-radius: 12px;
          border: 1px solid var(--border);
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border);
        }

        .section-icon { color: var(--primary); }

        .form-group-row {
          display: flex;
          gap: 20px;
          margin-bottom: 16px;
        }

        .form-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .flex-2 { flex: 2; }
        .flex-1 { flex: 1; }

        label {
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        input, select, textarea {
          background-color: var(--bg-sidebar);
          border: 1px solid var(--border-strong);
          border-radius: 6px;
          padding: 10px 12px;
          color: var(--text-main);
          font-size: 14px;
          outline: none;
        }

        input:focus, select:focus, textarea:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px var(--primary-muted);
        }

        .guarantee-section {
          margin-top: 16px;
          padding: 16px;
          background-color: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .checkbox-group.warning {
          margin-top: 12px;
          color: var(--warning);
          font-size: 13px;
        }

        input[type="checkbox"] { width: auto; }
      `}</style>
    </div>
  )
}

export default MarchesPublics
