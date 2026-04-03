import React from 'react'
import { Sparkles, BarChart3, TrendingUp, AlertCircle } from 'lucide-react'

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="ia-analysis-card animate-fade-in">
        <header className="card-header">
          <Sparkles className="sparkles-icon" size={20} />
          <h2>Analyse IA détaillée</h2>
        </header>
        
        <div className="card-body">
          <p className="intro-text">
            En tant qu'expert en estimation de projets BTP en Algérie, fort de 20 ans d'expérience, je procède à l'analyse de votre projet de villa R+2 dans la Wilaya 16.
          </p>

          <section className="analysis-section">
            <h3>## SYNTHÈSE EXÉCUTIVE</h3>
            <p>
              Le projet de villa R+2 de 150 m² en Wilaya 16 (Alger) présente un coût estimé de 14 850 000 DZD pour une finition standard, avec une fourchette acceptable de 13 365 000 DZD à 17 077 500 DZD. Le délai de réalisation projeté est de 53 jours, ce qui est particulièrement court pour une villa de cette envergure.
            </p>
          </section>

          <section className="analysis-section">
            <h3>## ANALYSE DES RISQUES</h3>
            <ul className="risk-list">
              <li>
                <strong>**Risque 1: Fluctuation des prix des matériaux**</strong> - Criticité: Élevée. Alger est sensible aux variations des cours des matériaux de construction (ciment, acier) importés ou locaux.
              </li>
              <li>
                <strong>**Risque 2: Disponibilité et qualité de la main-d'œuvre**</strong> - Criticité: Moyenne. Bien que la Wilaya 16 dispose d'une main-d'œuvre abondante, trouver des équipes qualifiées est un défi.
              </li>
            </ul>
          </section>

          <section className="ventilation-section">
            <h3>## VENTILATION DÉTAILLÉE</h3>
            <div className="ventilation-grid">
              <div className="ventilation-item">
                <span className="label">Gros œuvre</span>
                <span className="value">6 682 500 DZD (45%)</span>
              </div>
              <div className="ventilation-item">
                <span className="label">Plomberie</span>
                <span className="value">1 188 000 DZD (8%)</span>
              </div>
              <div className="ventilation-item">
                <span className="label">Électricité</span>
                <span className="value">1 485 000 DZD (10%)</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <style jsx="true">{`
        .dashboard {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .ia-analysis-card {
          background-color: white;
          color: #1E293B;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 20px 24px;
          border-bottom: 1px solid #E2E8F0;
        }

        .sparkles-icon {
          color: var(--primary);
        }

        .card-header h2 {
          font-size: 18px;
          font-weight: 600;
        }

        .card-body {
          padding: 24px;
        }

        .intro-text {
          font-size: 15px;
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .analysis-section {
          margin-bottom: 24px;
        }

        .analysis-section h3 {
          font-size: 14px;
          color: #64748B;
          margin-bottom: 12px;
          letter-spacing: 0.05em;
        }

        .analysis-section p {
          font-size: 14px;
          line-height: 1.6;
        }

        .risk-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .risk-list li {
          font-size: 14px;
          padding-left: 16px;
          position: relative;
        }

        .risk-list li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--primary);
        }

        .ventilation-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
          margin-top: 12px;
        }

        .ventilation-item {
          background-color: #F8FAFC;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid #E2E8F0;
        }

        .ventilation-item .label {
          display: block;
          font-size: 12px;
          color: #64748B;
          margin-bottom: 4px;
        }

        .ventilation-item .value {
          font-size: 14px;
          font-weight: 600;
          color: #1E293B;
        }
      `}</style>
    </div>
  )
}

export default Dashboard
