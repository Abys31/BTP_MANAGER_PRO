import React from 'react'
import { Construction } from 'lucide-react'

const Placeholder = ({ title }) => {
  return (
    <div className="placeholder-page">
      <Construction size={64} color="var(--primary)" />
      <h1>{title}</h1>
      <p>Ce module est actuellement en cours de développement pour la version 1.1 d'Atlas Manager.</p>
      
      <style jsx="true">{`
        .placeholder-page {
          height: 70vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: var(--text-main);
        }
        .placeholder-page h1 { font-size: 32px; margin: 24px 0 8px; }
        .placeholder-page p { color: var(--text-muted); max-width: 400px; }
      `}</style>
    </div>
  )
}

export default Placeholder
