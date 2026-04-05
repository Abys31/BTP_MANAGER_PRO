import React, { useState, useEffect } from 'react'
import { Truck, Package, Search, Plus, Filter, ClipboardList, MapPin, X, CheckCircle2, Loader2 } from 'lucide-react'
import { api } from '../utils/api'

const Logistics = () => {
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newBL, setNewBL] = useState({
    truck: '',
    material: 'Ciment (Sacs)',
    quantity: '',
    source: '',
    status: 'Reçu',
    date: new Date().toLocaleDateString('fr-FR')
  })

  useEffect(() => {
    fetchDeliveries()
  }, [])

  const fetchDeliveries = async () => {
    try {
      const data = await api.getLogistics()
      setDeliveries(data)
    } catch (error) {
      console.error("Erreur chargement logistique:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBL = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const savedBL = await api.createLogistics(newBL)
      setDeliveries([savedBL, ...deliveries])
      setShowModal(false)
      setNewBL({ truck: '', material: 'Ciment (Sacs)', quantity: '', source: '', status: 'Reçu', date: new Date().toLocaleDateString('fr-FR') })
      alert("✅ Bon de Livraison enregistré en base de données !")
    } catch (error) {
      alert("❌ Erreur lors de l'enregistrement du BL")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="logistics-page">
      {showModal && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Nouveau Bon de Livraison (BL)</h2>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddBL}>
              <div className="form-group">
                <label>Camion (Matricule)</label>
                <input required value={newBL.truck} onChange={e => setNewBL({...newBL, truck: e.target.value})} placeholder="ex: 01234-121-16" />
              </div>
              <div className="form-group">
                <label>Matériau</label>
                <select value={newBL.material} onChange={e => setNewBL({...newBL, material: e.target.value})}>
                  <option>Ciment (Sacs)</option>
                  <option>Sable Oued</option>
                  <option>Agrégats 15/25</option>
                  <option>Acier HA12</option>
                  <option>Briques</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Quantité</label>
                  <input required value={newBL.quantity} onChange={e => setNewBL({...newBL, quantity: e.target.value})} placeholder="ex: 120 sacs ou 15m³" />
                </div>
                <div className="form-group">
                  <label>Provenance</label>
                  <input required value={newBL.source} onChange={e => setNewBL({...newBL, source: e.target.value})} placeholder="ex: Carrière Tipaza" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? <Loader2 size={18} className="animate-spin" /> : 'Enregistrer BL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="logistics-header">
        <h1>Logistique & Matériaux</h1>
        <div className="header-actions">
          <button className="btn-outline" onClick={() => alert('Filtre désactivé en mode démo')}><Filter size={18} /> Filtrer</button>
          <button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={18} /> Nouveau Bon</button>
        </div>
      </div>

      <div className="inventory-summary">
        <div className="inv-card">
           <div className="inv-icon"><Package size={24} /></div>
           <div className="inv-data">
              <span className="label">Stock estimé</span>
              <span className="value">Calcul en cours...</span>
           </div>
        </div>
        <div className="inv-card">
           <div className="inv-icon"><Truck size={24} /></div>
           <div className="inv-data">
              <span className="label">Bons total</span>
              <span className="value">{deliveries.length} BL</span>
           </div>
        </div>
        <div className="inv-card">
           <div className="inv-icon" style={{color: 'var(--primary)'}}><MapPin size={24} /></div>
           <div className="inv-data">
              <span className="label">Base de données</span>
              <span className="value">Connectée</span>
           </div>
        </div>
      </div>

      <div className="deliveries-section">
        <div className="section-title">
           <ClipboardList size={20} />
           <h2>Suivi Réel des Bons de Livraison</h2>
        </div>
        <div className="delivery-table">
          <div className="table-header">
            <div>Date</div>
            <div>Camion (Matricule)</div>
            <div>Matériau</div>
            <div>Quantité</div>
            <div>Provenance</div>
            <div>Statut</div>
          </div>
          {loading ? (
             <div className="loading-row">Chargement des données...</div>
          ) : (
            <>
              {deliveries.length === 0 && <div className="empty-row">Aucun bon de livraison enregistré.</div>}
              {deliveries.map(item => (
                <div key={item.id} className="table-row animate-fade-in">
                  <div className="date-col">{item.date}</div>
                  <div className="truck-col">{item.truck}</div>
                  <div className="mat-col">{item.material}</div>
                  <div className="qty-col">{item.quantity}</div>
                  <div className="src-col">{item.source || '-'}</div>
                  <div className="status-col">
                     <span className={`status-pill ${item.status === 'Reçu' ? 'received' : 'transit'}`}>
                        {item.status}
                     </span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <style jsx="true">{`
        .logistics-page { max-width: 1200px; margin: 0 auto; color: var(--text-main); }
        .logistics-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        .logistics-header h1 { font-size: 28px; font-weight: 700; }
        
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 2000; }
        .modal-content { background: var(--bg-card); width: 500px; border-radius: 20px; border: 1px solid var(--border); padding: 32px; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .modal-header h2 { font-size: 20px; font-weight: 700; }
        
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-size: 13px; color: var(--text-muted); margin-bottom: 8px; }
        .form-group input, .form-group select { width: 100%; background: var(--bg-sidebar); border: 1px solid var(--border-strong); border-radius: 10px; padding: 12px; color: white; outline: none; transition: var(--transition); }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px; }

        .inventory-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 40px; }
        .inv-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; display: flex; align-items: center; gap: 20px; transition: var(--transition); }
        .inv-card:hover { border-color: var(--primary-muted); transform: translateY(-4px); }
        .inv-icon { width: 56px; height: 56px; background: var(--bg-sidebar); border-radius: 14px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); }
        .inv-data .label { font-size: 13px; color: var(--text-muted); display: block; margin-bottom: 4px; }
        .inv-data .value { font-size: 20px; font-weight: 800; color: white; }

        .deliveries-section { background: var(--bg-card); border-radius: 20px; border: 1px solid var(--border); overflow: hidden; }
        .section-title { padding: 24px; background: rgba(255,255,255,0.02); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; }
        .section-title h2 { font-size: 16px; font-weight: 700; }

        .delivery-table .table-header { display: grid; grid-template-columns: 100px 140px 1fr 100px 1fr 100px; padding: 16px 24px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); background: rgba(0,0,0,0.2); }
        .delivery-table .table-row { display: grid; grid-template-columns: 100px 140px 1fr 100px 1fr 100px; padding: 16px 24px; align-items: center; border-bottom: 1px solid var(--border); font-size: 13.5px; transition: var(--transition); }
        .delivery-table .table-row:hover { background: rgba(255,255,255,0.02); }

        .status-pill { padding: 4px 10px; border-radius: 20px; font-size: 10.5px; font-weight: 800; }
        .status-pill.received { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .status-pill.transit { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }

        .btn-primary { background: var(--primary); color: white; padding: 10px 24px; border-radius: 12px; display: flex; align-items: center; gap: 8px; font-weight: 700; min-width: 150px; justify-content: center; }
        .btn-secondary { background: var(--bg-sidebar); color: white; padding: 10px 24px; border-radius: 12px; font-weight: 700; }
        .btn-outline { border: 1px solid var(--border-strong); color: var(--text-secondary); padding: 10px 20px; border-radius: 12px; display: flex; align-items: center; gap: 8px; }

        .loading-row, .empty-row { text-align: center; padding: 40px; color: var(--text-muted); font-style: italic; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  )
}

export default Logistics
