import React from 'react'
import { Wallet, LineChart, Receipt, CreditCard } from 'lucide-react'

const Finance = () => {
  return (
    <div className="finance-page">
      <h1>Finance & Facturation</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <Wallet size={24} color="var(--success)" />
          <div className="stat-info">
            <span className="label">Chiffre d'Affaire</span>
            <span className="value">42.5 M DZD</span>
          </div>
        </div>
        <div className="stat-card">
          <Receipt size={24} color="var(--error)" />
          <div className="stat-info">
            <span className="label">Dépenses Cumulées</span>
            <span className="value">18.2 M DZD</span>
          </div>
        </div>
        <div className="stat-card">
          <CreditCard size={24} color="var(--warning)" />
          <div className="stat-info">
            <span className="label">Factures en Attente</span>
            <span className="value">4.1 M DZD</span>
          </div>
        </div>
      </div>
      <style jsx="true">{`
        .finance-page h1 { font-size: 24px; margin-bottom: 24px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
        .stat-card { background: var(--bg-card); padding: 20px; border-radius: 12px; border: 1px solid var(--border); display: flex; align-items: center; gap: 16px; }
        .stat-info .label { display: block; font-size: 13px; color: var(--text-muted); }
        .stat-info .value { font-size: 18px; font-weight: 700; color: var(--text-main); }
      `}</style>
    </div>
  )
}

export default Finance
