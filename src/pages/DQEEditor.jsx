import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { parseDQEExcel } from '../utils/excelImport'
import { 
  FileSpreadsheet, 
  Plus, 
  Trash2, 
  Save, 
  Upload, 
  ChevronRight, 
  ChevronDown, 
  Calculator,
  LayoutGrid
} from 'lucide-react'

const DQEEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [marche, setMarche] = useState(null)
  const [lots, setLots] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [expandedLots, setExpandedLots] = useState({})

  useEffect(() => {
    fetchMarche()
  }, [id])

  const fetchMarche = async () => {
    try {
      const data = await api.getMarches()
      const current = data.find(m => m.id === parseInt(id))
      if (current) {
        setMarche(current)
        setLots(current.lots || [])
        // Expand all initially
        const expanded = {}
        current.lots?.forEach(l => expanded[l.id || l.tempId] = true)
        setExpandedLots(expanded)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    try {
      setLoading(true)
      const parsedLots = await parseDQEExcel(file)
      // Add temp IDs for react keys
      const lotsWithIds = parsedLots.map(l => ({
        ...l,
        tempId: Math.random(),
        sections: l.sections.map(s => ({
          ...s,
          tempId: Math.random(),
          articles: s.articles.map(a => ({ ...a, tempId: Math.random() }))
        }))
      }))
      setLots(lotsWithIds)
    } catch (err) {
      alert("Erreur lors de l'import Excel: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleLot = (lotId) => {
    setExpandedLots(prev => ({ ...prev, [lotId]: !prev[lotId] }))
  }

  const calculateTotalMarche = () => {
    return lots.reduce((total, lot) => {
      return total + lot.sections.reduce((sTotal, section) => {
        return sTotal + section.articles.reduce((aTotal, article) => {
          return aTotal + (article.quantite * article.prixUnit || 0)
        }, 0)
      }, 0)
    }, 0)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.createAttachment({ marcheId: id, lots }) // Needs a specific endpoint for DQE bulk update
      // Actually, I created /api/marches/:id/dqe in the backend
      const res = await fetch(`http://localhost:5000/api/marches/${id}/dqe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('btp_token')}`
        },
        body: JSON.stringify({ lots })
      })
      const data = await res.json()
      if (data.message) {
        alert("DQE sauvegardé avec succès")
        navigate(`/marches`)
      }
    } catch (err) {
      alert("Erreur lors de la sauvegarde")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="loading">Chargement du DQE...</div>

  return (
    <div className="dqe-editor">
      <header className="dqe-header">
        <div className="header-info">
          <h1>Éditeur de DQE</h1>
          <p>{marche?.operation ? `${marche.operation} (Wilaya ${marche.wilaya})` : 'Chargement...'}</p>
        </div>
        
        <div className="header-actions">
          <label className="btn-import">
            <Upload size={18} />
            <span>Importer Excel</span>
            <input type="file" hidden accept=".xlsx, .xls" onChange={handleFileUpload} />
          </label>
          
          <button className="btn-save" onClick={handleSave} disabled={saving}>
            <Save size={18} />
            <span>{saving ? 'Sauvegarde...' : 'Enregistrer'}</span>
          </button>
        </div>
      </header>

      <div className="dqe-stats animate-fade-in">
        <div className="stat-item highlight">
          <Calculator size={20} />
          <div className="stat-content">
            <span className="label">Total Marché (HT)</span>
            <span className="value">{calculateTotalMarche().toLocaleString('fr-DZ')} DZD</span>
          </div>
        </div>
        <div className="stat-item">
          <LayoutGrid size={20} />
          <div className="stat-content">
            <span className="label">Structure</span>
            <span className="value">{lots.length} Lots | {lots.reduce((acc, l) => acc + l.sections.length, 0)} Sections</span>
          </div>
        </div>
      </div>

      <div className="dqe-content">
        {lots.length === 0 ? (
          <div className="empty-state">
            <FileSpreadsheet size={48} />
            <h2>Aucun Lot pour ce DQE</h2>
            <p>Utilisez le bouton "Importer Excel" ou créez manuellement vos lots.</p>
            <button className="btn-primary-alt" onClick={() => setLots([{ name: "Nouveau Lot", sections: [], tempId: Date.now() }])}>
              <Plus size={18} /> Ajouter un Lot
            </button>
          </div>
        ) : (
          <div className="lots-list">
            {lots.map((lot) => (
              <div key={lot.id || lot.tempId} className="lot-container">
                <div className="lot-header" onClick={() => toggleLot(lot.id || lot.tempId)}>
                  {expandedLots[lot.id || lot.tempId] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  <div className="lot-title">
                    <span className="badge">LOT</span>
                    <input 
                      value={lot.name} 
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const newLots = [...lots];
                        const l = newLots.find(nl => (nl.id || nl.tempId) === (lot.id || lot.tempId));
                        l.name = e.target.value;
                        setLots(newLots);
                      }}
                    />
                  </div>
                  <div className="lot-actions">
                    <button className="delete-btn" onClick={(e) => {
                      e.stopPropagation();
                      setLots(lots.filter(l => (l.id || l.tempId) !== (lot.id || lot.tempId)));
                    }}><Trash2 size={16} /></button>
                  </div>
                </div>

                {expandedLots[lot.id || lot.tempId] && (
                  <div className="sections-list">
                    {lot.sections.map((section) => (
                      <div key={section.id || section.tempId} className="section-container">
                        <div className="section-header">
                          <div className="section-title">
                            <span className="section-badge">SECTION</span>
                            <input value={section.name} onChange={(e) => {
                              const newLots = [...lots];
                              const l = newLots.find(nl => (nl.id || nl.tempId) === (lot.id || lot.tempId));
                              const s = l.sections.find(ns => (ns.id || ns.tempId) === (section.id || section.tempId));
                              s.name = e.target.value;
                              setLots(newLots);
                            }} />
                          </div>
                        </div>

                        <table className="articles-table">
                          <thead>
                            <tr>
                              <th width="80">Code</th>
                              <th>Désignation</th>
                              <th width="60">Unité</th>
                              <th width="100">Quantité</th>
                              <th width="120">Prix Unitaire</th>
                              <th width="140">Montant HT</th>
                              <th width="40"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {section.articles.map((article) => (
                              <tr key={article.id || article.tempId}>
                                <td><input value={article.code} onChange={(e) => {
                                  const newLots = [...lots];
                                  const a = newLots.find(nl => (nl.id || nl.tempId) === (lot.id || lot.tempId))
                                             .sections.find(ns => (ns.id || ns.tempId) === (section.id || section.tempId))
                                             .articles.find(na => (na.id || na.tempId) === (article.id || article.tempId));
                                  a.code = e.target.value;
                                  setLots(newLots);
                                }} /></td>
                                <td><input className="designation-input" value={article.libelle} onChange={(e) => {
                                  const newLots = [...lots];
                                  const a = newLots.find(nl => (nl.id || nl.tempId) === (lot.id || lot.tempId))
                                             .sections.find(ns => (ns.id || ns.tempId) === (section.id || section.tempId))
                                             .articles.find(na => (na.id || na.tempId) === (article.id || article.tempId));
                                  a.libelle = e.target.value;
                                  setLots(newLots);
                                }} /></td>
                                <td><input value={article.unite} onChange={(e) => {
                                  const newLots = [...lots];
                                  const a = newLots.find(nl => (nl.id || nl.tempId) === (lot.id || lot.tempId))
                                             .sections.find(ns => (ns.id || ns.tempId) === (section.id || section.tempId))
                                             .articles.find(na => (na.id || na.tempId) === (article.id || article.tempId));
                                  a.unite = e.target.value;
                                  setLots(newLots);
                                }} /></td>
                                <td><input type="number" value={article.quantite} onChange={(e) => {
                                  const newLots = [...lots];
                                  const a = newLots.find(nl => (nl.id || nl.tempId) === (lot.id || lot.tempId))
                                             .sections.find(ns => (ns.id || ns.tempId) === (section.id || section.tempId))
                                             .articles.find(na => (na.id || na.tempId) === (article.id || article.tempId));
                                  a.quantite = parseFloat(e.target.value) || 0;
                                  setLots(newLots);
                                }} /></td>
                                <td><input type="number" value={article.prixUnit} onChange={(e) => {
                                  const newLots = [...lots];
                                  const a = newLots.find(nl => (nl.id || nl.tempId) === (lot.id || lot.tempId))
                                             .sections.find(ns => (ns.id || ns.tempId) === (section.id || section.tempId))
                                             .articles.find(na => (na.id || na.tempId) === (article.id || article.tempId));
                                  a.prixUnit = parseFloat(e.target.value) || 0;
                                  setLots(newLots);
                                }} /></td>
                                <td className="amount-col">{(article.quantite * article.prixUnit || 0).toLocaleString('fr-DZ')}</td>
                                <td><button className="row-delete" onClick={() => {
                                  const newLots = [...lots];
                                  const s = newLots.find(nl => (nl.id || nl.tempId) === (lot.id || lot.tempId))
                                                   .sections.find(ns => (ns.id || ns.tempId) === (section.id || section.tempId));
                                  s.articles = s.articles.filter(na => (na.id || na.tempId) !== (article.id || article.tempId));
                                  setLots(newLots);
                                }}><Trash2 size={14} /></button></td>
                              </tr>
                            ))}
                            <tr className="add-article-row">
                              <td colSpan="7">
                                <button className="btn-add-inline" onClick={() => {
                                  const newLots = [...lots];
                                  const s = newLots.find(nl => (nl.id || nl.tempId) === (lot.id || lot.tempId))
                                                   .sections.find(ns => (ns.id || ns.tempId) === (section.id || section.tempId));
                                  s.articles.push({ code: '', libelle: 'Nouvel article...', unite: 'U', quantite: 0, prixUnit: 0, tempId: Date.now() });
                                  setLots(newLots);
                                }}>
                                  <Plus size={14} /> Ajouter un article
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ))}
                    <button className="btn-add-section" onClick={() => {
                      const newLots = [...lots];
                      const l = newLots.find(nl => (nl.id || nl.tempId) === (lot.id || lot.tempId));
                      l.sections.push({ name: "Nouvelle Section", articles: [], tempId: Date.now() });
                      setLots(newLots);
                    }}>
                      <Plus size={14} /> Ajouter une Section
                    </button>
                  </div>
                )}
              </div>
            ))}
            <div className="lots-footer">
               <button className="btn-add-lot" onClick={() => setLots([...lots, { name: "Nouveau Lot", sections: [], tempId: Date.now() }])}>
                 <Plus size={18} /> Ajouter un Lot
               </button>
            </div>
          </div>
        )}
      </div>

      <style jsx="true">{`
        .dqe-editor { max-width: 1200px; margin: 0 auto; color: var(--text-main); }
        .dqe-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding: 20px; background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border); }
        .header-info h1 { font-size: 24px; margin-bottom: 4px; }
        .header-info p { color: var(--text-muted); font-size: 14px; }
        
        .header-actions { display: flex; gap: 12px; }
        .btn-import { background: var(--bg-sidebar); border: 1px solid var(--border-strong); color: var(--text-secondary); padding: 10px 20px; border-radius: 8px; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: var(--transition); }
        .btn-import:hover { border-color: var(--primary); color: var(--primary); }
        .btn-save { background: var(--primary); color: white; padding: 10px 24px; border-radius: 8px; display: flex; align-items: center; gap: 8px; font-weight: 600; }
        
        .dqe-stats { display: flex; gap: 20px; margin-bottom: 30px; }
        .stat-item { background: var(--bg-card); border: 1px solid var(--border); padding: 16px 24px; border-radius: 12px; display: flex; align-items: center; gap: 16px; flex: 1; }
        .stat-item.highlight { border-color: var(--primary); background: var(--primary-muted); }
        .stat-content .label { display: block; font-size: 13px; color: var(--text-muted); }
        .stat-content .value { font-size: 18px; font-weight: 700; }
        
        .empty-state { text-align: center; padding: 80px; background: var(--bg-card); border-radius: 12px; border: 1px dashed var(--border-strong); color: var(--text-muted); }
        .empty-state h2 { color: white; margin: 16px 0 8px; }
        .btn-primary-alt { margin-top: 20px; background: var(--primary); color: white; padding: 12px 24px; border-radius: 8px; display: flex; align-items: center; gap: 8px; margin: 20px auto; }
        
        .lot-container { margin-bottom: 16px; border-radius: 12px; overflow: hidden; background: var(--bg-card); border: 1px solid var(--border); }
        .lot-header { padding: 16px 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; background: rgba(255, 255, 255, 0.03); transition: var(--transition); }
        .lot-header:hover { background: rgba(255, 255, 255, 0.06); }
        .badge { background: var(--primary); color: white; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; }
        .lot-title { flex: 1; display: flex; align-items: center; gap: 12px; }
        .lot-title input { background: transparent; border: none; font-size: 16px; font-weight: 700; color: white; width: 100%; outline: none; }
        
        .sections-list { padding: 0 0 20px 40px; }
        .section-container { margin: 16px 20px 16px 0; border: 1px solid var(--border-strong); border-top: 3px solid var(--text-muted); background: rgba(0,0,0,0.1); }
        .section-header { padding: 12px 16px; background: rgba(255,255,255,0.02); }
        .section-badge { background: #475569; color: white; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; }
        .section-title input { background: transparent; border: none; font-size: 14px; font-weight: 600; color: white; width: 100%; outline: none; margin-top: 4px; }
        
        .articles-table { width: 100%; border-collapse: collapse; }
        .articles-table th { padding: 12px 16px; font-size: 12px; color: var(--text-muted); text-align: left; background: rgba(0,0,0,0.2); border-bottom: 1px solid var(--border-strong); }
        .articles-table td { padding: 8px 16px; border-bottom: 1px solid var(--border-strong); }
        .articles-table input { background: transparent; border: 1px solid transparent; color: #E2E8F0; width: 100%; padding: 4px 8px; border-radius: 4px; font-size: 13px; }
        .articles-table input:hover { border-color: var(--border-strong); }
        .articles-table input:focus { border-color: var(--primary); background: var(--bg-sidebar); outline: none; }
        .designation-input { font-weight: 500; }
        .amount-col { font-family: monospace; text-align: right; font-weight: 600; color: var(--primary); }
        
        .row-delete { color: var(--text-muted); }
        .row-delete:hover { color: var(--error); }
        
        .add-article-row { background: rgba(0,0,0,0.1); }
        .btn-add-inline { width: 100%; display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-muted); padding: 8px; }
        .btn-add-inline:hover { color: var(--primary); background: var(--primary-muted); }
        
        .btn-add-section { margin-top: 12px; display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--primary); font-weight: 600; }
        .btn-add-lot { display: flex; align-items: center; gap: 10px; padding: 14px 28px; border: 1px dashed var(--border-strong); border-radius: 12px; color: var(--text-secondary); width: 100%; justify-content: center; transition: var(--transition); }
        .btn-add-lot:hover { color: var(--primary); border-color: var(--primary); background: var(--primary-muted); }
      `}</style>
    </div>
  )
}

export default DQEEditor
