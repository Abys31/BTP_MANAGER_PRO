import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { wilayas } from '../data/wilayas'
import { api } from '../utils/api'
import { 
  Save, 
  FileText, 
  Landmark, 
  Wallet, 
  AlertTriangle, 
  Loader2, 
  CheckCircle,
  FileSpreadsheet,
  Plus
} from 'lucide-react'

const MarchesPublics = () => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [marches, setMarches] = useState([])
  const [formData, setFormData] = useState({
    maitreOuvrage: '',
    operation: '',
    numeroOperation: '',
    wilaya: '16',
    type: 'marché',
    numeroMarche: '',
    dateMarche: '',
    objet: '',
    visaCF: '',
    dateVisaCF: '',
    valeurHT: '',
    tva: '19',
    retenueGarantie: true,
    cautionBonneEx: false
  })

  const navigate = useNavigate()

  useEffect(() => {
    fetchMarches()
  }, [])

  const fetchMarches = async () => {
    try {
      const data = await api.getMarches()
      setMarches(data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError('')
    try {
      const payload = {
        ...formData,
        valeurHT: parseFloat(formData.valeurHT) || 0,
        tva: parseFloat(formData.tva) || 19,
        dateMarche: formData.dateMarche ? new Date(formData.dateMarche) : null,
        dateVisaCF: formData.dateVisaCF ? new Date(formData.dateVisaCF) : null,
      }
      const data = await api.createMarche(payload)
      if (data.id) {
        setSuccess(true)
        setFormData({
            maitreOuvrage: '',
            operation: '',
            numeroOperation: '',
            wilaya: '16',
            type: 'marché',
            numeroMarche: '',
            dateMarche: '',
            objet: '',
            visaCF: '',
            dateVisaCF: '',
            valeurHT: '',
            tva: '19',
            retenueGarantie: true,
            cautionBonneEx: false
        })
        fetchMarches()
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(data.message || 'Erreur lors de la sauvegarde')
      }
    } catch (err) {
      setError('Impossible de se connecter au serveur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="marche-public-page">
      <div className="page-header">
        <h1>Nouveau Marché Public</h1>
        <div className="header-actions">
          {success && <div className="success-toast animate-fade-in"><CheckCircle size={16} /> Enregistré !</div>}
          {error && <div className="error-toast animate-fade-in"><AlertTriangle size={16} /> {error}</div>}
          
          <button className="btn-secondary" onClick={() => window.history.back()}>Annuler</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span>{loading ? 'Sauvegarde...' : 'Enregistrer'}</span>
          </button>
        </div>
      </div>

      <div className="form-grid">
        <section className="form-section">
          <div className="section-header">
            <FileText className="section-icon" size={20} />
            <h2>Informations Générales</h2>
          </div>
          
          <div className="form-group-row">
            <div className="form-group flex-2">
              <label>Maître d'Ouvrage</label>
              <input name="maitreOuvrage" value={formData.maitreOuvrage} onChange={handleChange} placeholder="ex: DEP Alger, Wilaya de Tipaza..." />
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group flex-2">
              <label>Intitulé de l'opération</label>
              <input name="operation" value={formData.operation} onChange={handleChange} placeholder="ex: Réalisation d'un groupe scolaire..." />
            </div>
            <div className="form-group flex-1">
              <label>Wilaya</label>
              <select name="wilaya" value={formData.wilaya} onChange={handleChange}>
                {wilayas.map(w => (
                  <option key={w.code} value={w.code}>{w.code} - {w.name}</option>
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
                <option value="avenant">Avenant</option>
              </select>
            </div>
          </div>
        </section>

        <section className="form-section">
          <div className="section-header">
            <Landmark className="section-icon" size={20} />
            <h2>Détails Réglementaires</h2>
          </div>
          <div className="form-group-row">
            <div className="form-group">
              <label>Numéro du Marché</label>
              <input name="numeroMarche" value={formData.numeroMarche} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Date du Marché</label>
              <input type="date" name="dateMarche" value={formData.dateMarche} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group-row">
            <div className="form-group">
              <label>Visa CF (Contrôle Financier)</label>
              <input name="visaCF" value={formData.visaCF} onChange={handleChange} placeholder="N° de visa..." />
            </div>
            <div className="form-group">
              <label>Date Visa CF</label>
              <input type="date" name="dateVisaCF" value={formData.dateVisaCF} onChange={handleChange} />
            </div>
          </div>
        </section>

        <section className="form-section">
          <div className="section-header">
            <Wallet className="section-icon" size={20} />
            <h2>Paramètres Financiers</h2>
          </div>
          <div className="form-group-row">
            <div className="form-group">
              <label>Valeur HT (DZD)</label>
              <input type="number" name="valeurHT" value={formData.valeurHT} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>TVA (%)</label>
              <select name="tva" value={formData.tva} onChange={handleChange}>
                <option value="19">19% (Standard)</option>
                <option value="9">9% (Spécifique)</option>
                <option value="0">0% (Exonéré)</option>
              </select>
            </div>
          </div>

          <div className="guarantee-section">
            <div className="checkbox-group">
              <input type="checkbox" id="retenueGarantie" name="retenueGarantie" checked={formData.retenueGarantie} onChange={handleChange} />
              <label htmlFor="retenueGarantie">Appliquer la retenue de garantie (5%)</label>
            </div>
            
            {!formData.retenueGarantie && (
              <div className="checkbox-group warning animate-fade-in">
                <AlertTriangle size={16} color="var(--warning)" />
                <input type="checkbox" id="cautionBonneEx" name="cautionBonneEx" checked={formData.cautionBonneEx} onChange={handleChange} />
                <label htmlFor="cautionBonneEx">Caution de bonne exécution requise</label>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="marches-list animate-fade-in">
        <div className="list-header">
          <h2>Mes Marchés Publics ({marches.length})</h2>
          <p>Gérez vos DQE et structures de lots par projet</p>
        </div>
        
        <div className="list-grid">
          {marches.length === 0 ? (
            <div className="empty-list">Aucun marché enregistré.</div>
          ) : (
            marches.map(m => (
              <div key={m.id} className="marche-card" onClick={() => navigate(`/marches/${m.id}`)}>
                <div className="card-info">
                  <h3>{m.operation || "Sans titre"}</h3>
                  <span className="maitre">{m.maitreOuvrage}</span>
                  <div className="tags">
                    <span className="tag-wilaya">{m.wilaya}</span>
                    <span className="tag-type">{m.type}</span>
                  </div>
                </div>
                <div className="card-footer">
                  <span className="valeur">{(m.valeurHT || 0).toLocaleString()} DA</span>
                  <button className="btn-dqe" onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/marches/${m.id}/dqe`)
                  }}>
                    <FileSpreadsheet size={16} /> <span>DQE</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx="true">{`
        .marche-public-page { max-width: 1000px; margin: 0 auto; color: var(--text-main); }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .page-header h1 { font-size: 24px; font-weight: 700; }
        
        .header-actions { display: flex; gap: 12px; align-items: center; }
        .success-toast { background: rgba(34, 197, 94, 0.1); color: #4ade80; padding: 8px 16px; border-radius: 6px; display: flex; align-items: center; gap: 8px; font-size: 14px; }
        .error-toast { background: rgba(239, 68, 68, 0.1); color: #f87171; padding: 8px 16px; border-radius: 6px; display: flex; align-items: center; gap: 8px; font-size: 14px; }

        .btn-primary { background-color: var(--primary); color: white; padding: 10px 20px; border-radius: 8px; display: flex; align-items: center; gap: 8px; font-weight: 600; cursor: pointer; }
        .btn-secondary { background: var(--bg-sidebar); border: 1px solid var(--border-strong); color: var(--text-secondary); padding: 10px 20px; border-radius: 8px; cursor: pointer; }

        .form-grid { display: flex; flex-direction: column; gap: 24px; margin-bottom: 60px; }
        .form-section { background-color: var(--bg-card); padding: 24px; border-radius: 12px; border: 1px solid var(--border); }
        .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
        .section-header h2 { font-size: 16px; font-weight: 600; }
        .section-icon { color: var(--primary); }

        .form-group-row { display: flex; gap: 20px; margin-bottom: 16px; }
        .form-group { flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .flex-2 { flex: 2; }
        .flex-1 { flex: 1; }
        label { font-size: 13px; color: var(--text-secondary); }
        input, select, textarea { background-color: var(--bg-sidebar); border: 1px solid var(--border-strong); border-radius: 6px; padding: 10px 12px; color: var(--text-main); outline: none; transition: var(--transition); }
        input:focus { border-color: var(--primary); }

        .guarantee-section { margin-top: 16px; padding: 16px; background-color: rgba(255, 255, 255, 0.02); border-radius: 8px; }
        .checkbox-group { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .checkbox-group.warning { margin-top: 12px; color: var(--warning); font-size: 13px; }

        /* Project List Styles */
        .marches-list { margin-top: 60px; padding-top: 40px; border-top: 1px solid var(--border); }
        .list-header { margin-bottom: 30px; }
        .list-header h2 { font-size: 20px; margin-bottom: 4px; }
        .list-header p { font-size: 13px; color: var(--text-muted); }

        .list-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
        .marche-card { background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border); overflow: hidden; transition: all 0.3s ease; }
        .marche-card:hover { transform: translateY(-4px); border-color: var(--primary); box-shadow: 0 12px 24px -10px rgba(0,0,0,0.3); }
        
        .card-info { padding: 24px; }
        .card-info h3 { font-size: 17px; font-weight: 700; margin-bottom: 8px; line-height: 1.4; height: 48px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .card-info .maitre { font-size: 13px; color: var(--text-muted); display: block; margin-bottom: 16px; }
        
        .tags { display: flex; gap: 8px; }
        .tag-wilaya { font-size: 11px; background: var(--primary-muted); color: var(--primary); padding: 4px 10px; border-radius: 6px; font-weight: 700; }
        .tag-type { font-size: 11px; background: rgba(255,255,255,0.05); color: var(--text-secondary); padding: 4px 10px; border-radius: 6px; }
        
        .card-footer { padding: 16px 24px; background: rgba(0,0,0,0.25); border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
        .card-footer .valeur { font-weight: 700; font-size: 15px; color: var(--primary); }
        .btn-dqe { display: flex; align-items: center; gap: 8px; background: var(--bg-sidebar); border: 1px solid var(--border-strong); color: white; font-size: 13px; padding: 8px 16px; border-radius: 8px; transition: var(--transition); }
        .btn-dqe:hover { border-color: var(--primary); background: var(--primary); }
        
        .empty-list { grid-column: 1 / -1; text-align: center; padding: 60px; color: var(--text-muted); background: var(--bg-card); border-radius: 12px; border: 1px dashed var(--border); }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  )
}

export default MarchesPublics
