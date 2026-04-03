import React from 'react'
import { Package, Truck, Warehouse, History } from 'lucide-react'

const Logistics = () => {
  return (
    <div className="logistics-page">
      <h1>Logistique & Stock</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <Warehouse size={24} color="var(--primary)" />
          <div className="stat-info">
            <span className="label">Entrepôts</span>
            <span className="value">4</span>
          </div>
        </div>
        <div className="stat-card">
          <Package size={24} color="var(--primary)" />
          <div className="stat-info">
            <span className="label">Articles en stock</span>
            <span className="value">142</span>
          </div>
        </div>
        <div className="stat-card">
          <Truck size={24} color="var(--primary)" />
          <div className="stat-info">
            <span className="label">Mouvements/Jour</span>
            <span className="value">+12</span>
          </div>
        </div>
      </div>

      <div className="placeholder-content">
        <History size={48} color="var(--text-muted)" />
        <p>Gestion des stocks et mouvements en cours de développement...</p>
      </div>

      <style jsx="true">{`
        .logistics-page h1 { font-size: 24px; margin-bottom: 24px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
        .stat-card { background: var(--bg-card); padding: 20px; border-radius: 12px; border: 1px solid var(--border); display: flex; align-items: center; gap: 16px; }
        .stat-info .label { display: block; font-size: 13px; color: var(--text-muted); }
        .stat-info .value { font-size: 18px; font-weight: 700; color: var(--text-main); }
        .placeholder-content { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 60px; color: var(--text-muted); background: var(--bg-card); border-radius: 12px; border: 1px dashed var(--border-strong); }
      `}</style>
    </div>
  )
}

export default Logistics
