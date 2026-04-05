import { TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, DollarSign, Download, Receipt, CreditCard } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { generateGlobalFinancialReport } from '../utils/reportGenerator'

const dataEvolution = [
  { name: 'Jan', depenses: 4.2, situations: 5.1 },
  { name: 'Fév', depenses: 3.8, situations: 4.5 },
  { name: 'Mar', depenses: 5.1, situations: 8.2 },
  { name: 'Avr', depenses: 2.9, situations: 3.1 },
]

const dataRepartition = [
  { name: 'Payé', value: 65, color: '#10b981' },
  { name: 'En attente', value: 25, color: '#f59e0b' },
  { name: 'Retard', value: 10, color: '#ef4444' },
]

const Finance = () => {
  const generateFinancialReport = () => {
    generateGlobalFinancialReport()
  }

  return (
    <div className="finance-page">
      <div className="finance-header">
        <div>
          <h1>Finance & Trésorerie</h1>
          <p>Suivi des encaissements et des dépenses du projet</p>
        </div>
        <button className="btn-primary" onClick={generateFinancialReport}><Download size={18} /> Rapport Financier</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <Wallet size={24} />
          </div>
          <div className="stat-info">
            <span className="label">Total Situations</span>
            <span className="value">42.5 M DZD</span>
            <span className="trend positive"><ArrowUpRight size={12} /> +12%</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <Receipt size={24} />
          </div>
          <div className="stat-info">
            <span className="label">Dépenses Cumulées</span>
            <span className="value">18.2 M DZD</span>
            <span className="trend negative"><ArrowDownRight size={12} /> +5.4%</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <CreditCard size={24} />
          </div>
          <div className="stat-info">
            <span className="label">Solde Trésorerie</span>
            <span className="value">24.3 M DZD</span>
            <span className="status-ok">Sain</span>
          </div>
        </div>
      </div>

      <div className="finance-main-grid">
        <div className="chart-container">
          <h3>Évolution Situations vs Dépenses (M DZD)</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataEvolution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend />
                <Bar dataKey="situations" name="Situations" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="depenses" name="Dépenses" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <h3>Répartition des Paiements</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dataRepartition}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataRepartition.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .finance-page { max-width: 1200px; margin: 0 auto; color: var(--text-main); }
        .finance-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 32px; }
        .finance-header h1 { font-size: 28px; font-weight: 700; margin-bottom: 4px; }
        .finance-header p { color: var(--text-muted); font-size: 14px; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 32px; }
        .stat-card { background: var(--bg-card); padding: 24px; border-radius: 16px; border: 1px solid var(--border); display: flex; align-items: center; gap: 20px; transition: var(--transition); }
        .stat-card:hover { border-color: var(--primary); transform: translateY(-2px); }
        .stat-icon { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
        .stat-info .label { display: block; font-size: 13px; color: var(--text-muted); margin-bottom: 4px; }
        .stat-info .value { font-size: 22px; font-weight: 800; color: white; display: block; }
        .trend { font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 4px; margin-top: 4px; }
        .trend.positive { color: #10b981; }
        .trend.negative { color: #ef4444; }
        .status-ok { font-size: 11px; background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 2px 8px; border-radius: 20px; font-weight: 700; margin-top: 4px; display: inline-block; }

        .finance-main-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
        .chart-container { background: var(--bg-card); padding: 24px; border-radius: 16px; border: 1px solid var(--border); }
        .chart-container h3 { font-size: 16px; margin-bottom: 24px; color: var(--text-secondary); }
        .chart-wrapper { width: 100%; height: 300px; }

        .btn-primary { background: var(--primary); color: white; padding: 10px 20px; border-radius: 8px; display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 14px; }

        @media (max-width: 1024px) {
          .finance-main-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}

export default Finance
