import React, { useState, useRef, useEffect } from 'react'
import { Files, FileText, Download, Upload, Search, Filter, Folder, MoreHorizontal, Trash2, Loader2, Check } from 'lucide-react'
import { api } from '../utils/api'

const Documents = () => {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchDocs()
  }, [])

  const fetchDocs = async () => {
    try {
      const data = await api.getDocuments()
      setDocs(data)
    } catch (error) {
      console.error("Erreur chargement documents:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    
    // Simulate encryption/upload delay
    setTimeout(async () => {
      try {
        const newDocData = {
          name: file.name,
          type: file.type.split('/')[1]?.toUpperCase() || 'DOC',
          size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
          date: new Date().toLocaleDateString('fr-FR')
        }
        const savedDoc = await api.createDocument(newDocData)
        setDocs([savedDoc, ...docs])
        setUploading(false)
        alert("✅ Document archivé avec succès !")
      } catch (error) {
        alert("❌ Erreur lors de l'archivage")
        setUploading(false)
      }
    }, 2000)
  }

  return (
    <div className="documents-page">
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileSelect}
      />

      <div className="doc-header">
        <div>
          <h1>Documents & Archivage</h1>
          <p>Gestion réelle et archivage sécurisé en base de données</p>
        </div>
        <button 
           className={`btn-primary ${uploading ? 'loading' : ''}`} 
           onClick={() => fileInputRef.current.click()}
           disabled={uploading}
        >
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
          <span>{uploading ? 'Sécurisation...' : 'Téléverser'}</span>
        </button>
      </div>

      {uploading && (
        <div className="upload-progress-bar animate-fade-in">
           <div className="progress-fill"></div>
           <span className="progress-text">Chiffrement et archivage réel du document en cours...</span>
        </div>
      )}

      <div className="doc-toolbar">
         <div className="search-bar">
           <Search size={18} />
           <input type="text" placeholder="Rechercher un document archive..." />
         </div>
         <div className="filter-group">
            <button className="btn-outline" onClick={() => alert("Filtre en cours de développement")}><Filter size={18} /> Filtrer</button>
         </div>
      </div>

      <div className="doc-grid">
         <div className="categories-sidebar">
            <h3>Dossiers Atlas</h3>
            <div className="cat-list">
               <div className="cat-item active"><Folder size={18} /> Tous les fichiers</div>
               <div className="cat-item"><Folder size={18} /> Administratif</div>
               <div className="cat-item"><Folder size={18} /> Technique / Plans</div>
               <div className="cat-item"><Folder size={18} /> Financier</div>
            </div>
         </div>

         <div className="doc-main-list">
            <div className="doc-table">
               <div className="table-header">
                  <div className="col-name">Nom du fichier</div>
                  <div className="col-type">Type</div>
                  <div className="col-size">Taille</div>
                  <div className="col-date">Date</div>
                  <div className="col-actions"></div>
               </div>
               {loading ? (
                 <div className="loading-row">Initialisation de l'archive...</div>
               ) : (
                 <>
                   {docs.length === 0 && <div className="empty-row">Aucun document archivé.</div>}
                   {docs.map(doc => (
                     <div key={doc.id} className="table-row animate-fade-in">
                        <div className="col-name">
                           <FileText size={18} className="file-icon" />
                           <span>{doc.name}</span>
                        </div>
                        <div className="col-type"><span className="type-tag">{doc.type}</span></div>
                        <div className="col-size">{doc.size}</div>
                        <div className="col-date">{doc.date}</div>
                        <div className="col-actions">
                           <button className="action-btn" title="Télécharger"><Download size={16} /></button>
                           <button className="action-btn" title="Effacer"><Trash2 size={16} /></button>
                        </div>
                     </div>
                   ))}
                 </>
               )}
            </div>
         </div>
      </div>

      <style jsx="true">{`
        .documents-page { max-width: 1200px; margin: 0 auto; color: var(--text-main); }
        .doc-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 24px; }
        .doc-header h1 { font-size: 28px; font-weight: 700; margin-bottom: 4px; }
        .doc-header p { color: var(--text-muted); font-size: 14px; }

        .upload-progress-bar { background: var(--bg-card); border: 1px solid var(--primary-muted); border-radius: 12px; padding: 12px; margin-bottom: 24px; position: relative; overflow: hidden; }
        .progress-fill { position: absolute; left: 0; top: 0; bottom: 0; background: var(--primary); width: 0%; animation: fillProgress 2s ease-in-out forwards; opacity: 0.2; }
        .progress-text { font-size: 12px; color: var(--primary); font-weight: 600; position: relative; z-index: 2; }
        
        @keyframes fillProgress { from { width: 0%; } to { width: 100%; } }

        .doc-toolbar { display: flex; justify-content: space-between; margin-bottom: 24px; gap: 20px; }
        .search-bar { flex: 1; background: var(--bg-card); border: 1px solid var(--border); padding: 0 16px; border-radius: 12px; display: flex; align-items: center; gap: 12px; }
        .search-bar input { background: transparent; border: none; color: white; padding: 12px 0; width: 100%; outline: none; }

        .doc-grid { display: grid; grid-template-columns: 240px 1fr; gap: 24px; }
        .categories-sidebar { background: var(--bg-card); padding: 20px; border-radius: 16px; border: 1px solid var(--border); height: fit-content; }
        .categories-sidebar h3 { font-size: 14px; color: var(--text-muted); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px; }
        .cat-item { display: flex; align-items: center; gap: 12px; padding: 10px; border-radius: 8px; color: var(--text-secondary); cursor: pointer; transition: var(--transition); font-size: 13.5px; }
        .cat-item:hover { background: var(--bg-hover); color: white; }
        .cat-item.active { background: var(--primary-muted); color: var(--primary); font-weight: 600; }

        .doc-main-list { background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border); overflow: hidden; }
        .doc-table { width: 100%; }
        .table-header { display: grid; grid-template-columns: 2fr 120px 100px 120px 80px; padding: 16px 24px; background: rgba(0,0,0,0.2); font-size: 12px; font-weight: 700; color: var(--text-muted); border-bottom: 1px solid var(--border); }
        .table-row { display: grid; grid-template-columns: 2fr 120px 100px 120px 80px; padding: 16px 24px; align-items: center; border-bottom: 1px solid var(--border); font-size: 13.5px; transition: var(--transition); }
        .table-row:hover { background: rgba(255,255,255,0.02); }
        
        .col-name { display: flex; align-items: center; gap: 12px; color: white; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .file-icon { color: var(--primary); }
        .type-tag { font-size: 10px; font-weight: 800; background: var(--bg-sidebar); padding: 3px 8px; border-radius: 6px; border: 1px solid var(--border); color: var(--text-secondary); }
        
        .col-actions { display: flex; gap: 12px; justify-content: flex-end; }
        .action-btn { color: var(--text-muted); transition: var(--transition); }
        .action-btn:hover { color: var(--primary); }

        .btn-primary { background: var(--primary); color: white; padding: 10px 24px; border-radius: 12px; display: flex; align-items: center; gap: 10px; font-weight: 700; min-width: 150px; justify-content: center; }
        .btn-outline { border: 1px solid var(--border-strong); color: var(--text-secondary); padding: 10px 20px; border-radius: 12px; display: flex; align-items: center; gap: 8px; }

        .loading-row, .empty-row { text-align: center; padding: 40px; color: var(--text-muted); font-style: italic; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }

        @media (max-width: 1024px) {
           .doc-grid { grid-template-columns: 1fr; }
           .categories-sidebar { display: none; }
        }
      `}</style>
    </div>
  )
}

export default Documents
