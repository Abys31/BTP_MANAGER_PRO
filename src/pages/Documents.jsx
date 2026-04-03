import React from 'react'
import { Files, FileText, Download } from 'lucide-react'

const Documents = () => {
  return (
    <div className="documents-page">
      <h1>Documents & Archivage</h1>
      <div className="doc-list">
        <div className="doc-item">
          <FileText size={20} />
          <div className="doc-info">
            <h4>Situation_01_Villa_R+2.pdf</h4>
            <span>29/01/2026 - 1.2 MB</span>
          </div>
          <button className="icon-btn"><Download size={18} /></button>
        </div>
      </div>
      <style jsx="true">{`
        .documents-page h1 { font-size: 24px; margin-bottom: 24px; }
        .doc-list { display: flex; flex-direction: column; gap: 8px; }
        .doc-item { background: var(--bg-card); padding: 12px 20px; border-radius: 8px; border: 1px solid var(--border); display: flex; align-items: center; gap: 16px; }
        .doc-info { flex: 1; }
        .doc-info h4 { font-size: 14px; margin-bottom: 2px; }
        .doc-info span { font-size: 11px; color: var(--text-muted); }
      `}</style>
    </div>
  )
}

export default Documents
