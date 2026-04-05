import React, { useState, useEffect } from 'react'
import { Users, UserPlus, Search, Phone, Mail, MapPin, MoreVertical, X, Check, Loader2 } from 'lucide-react'
import { api } from '../utils/api'

const Team = () => {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    tel: '',
    email: '',
    status: 'Sur Site'
  })

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      const data = await api.getStaff()
      setStaff(data)
    } catch (error) {
      console.error("Erreur lors de la récupération du personnel:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const savedMember = await api.createStaff(newMember)
      setStaff([savedMember, ...staff])
      setShowModal(false)
      setNewMember({ name: '', role: '', tel: '', email: '', status: 'Sur Site' })
      alert("✅ Collaborateur enregistré en base de données !")
    } catch (error) {
      alert("❌ Erreur lors de l'enregistrement")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="team-page">
      {showModal && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Ajouter un collaborateur</h2>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddMember}>
              <div className="form-group">
                <label>Nom complet</label>
                <input required value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} placeholder="ex: Omar Kadda" />
              </div>
              <div className="form-group">
                <label>Poste / Rôle</label>
                <input required value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})} placeholder="ex: Coffreur" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Téléphone</label>
                  <input value={newMember.tel} onChange={e => setNewMember({...newMember, tel: e.target.value})} placeholder="05XX..." />
                </div>
                <div className="form-group">
                  <label>Statut</label>
                  <select value={newMember.status} onChange={e => setNewMember({...newMember, status: e.target.value})}>
                    <option value="Sur Site">Sur Site</option>
                    <option value="Bureau">Bureau</option>
                    <option value="En Congé">En Congé</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? <Loader2 size={18} className="animate-spin" /> : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="team-header">
        <div>
          <h1>Équipe & RH</h1>
          <p>Gestion réelle du personnel enregistrée en base de données</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><UserPlus size={18} /> Ajouter un membre</button>
      </div>

      <div className="team-actions">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Rechercher un collaborateur..." />
        </div>
        <div className="filters">
          <button className="filter-chip active">Tous ({staff.length})</button>
          <button className="filter-chip">Sur Site</button>
          <button className="filter-chip">Bureau</button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
           <Loader2 size={32} className="animate-spin" />
           <p>Chargement du personnel...</p>
        </div>
      ) : (
        <div className="staff-grid">
          {staff.length === 0 && <div className="empty-state">Aucun membre enregistré.</div>}
          {staff.map(person => (
            <div key={person.id} className="staff-card animate-fade-in">
              <div className="card-top">
                 <div className="avatar-large">{person.name[0]}</div>
                 <span className={`status-tag ${person.status.toLowerCase().replace(' ', '-')}`}>{person.status}</span>
                 <button className="more-btn"><MoreVertical size={16} /></button>
              </div>
              <div className="card-content">
                <h3>{person.name}</h3>
                <span className="role-text">{person.role}</span>
                
                <div className="contact-info">
                  <div className="info-row"><Phone size={14} /><span>{person.tel || '-'}</span></div>
                  <div className="info-row"><Mail size={14} /><span>{person.email || '-'}</span></div>
                </div>
              </div>
              <div className="card-footer">
                 <button className="btn-outline-sm" onClick={() => alert("Action sur dossier...")}>Dossier</button>
                 <button className="btn-outline-sm" onClick={() => alert("Affecter à un autre projet...")}>Affecter</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx="true">{`
        .team-page { max-width: 1200px; margin: 0 auto; color: var(--text-main); }
        .team-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 32px; }
        .team-header h1 { font-size: 28px; font-weight: 700; margin-bottom: 4px; }
        .team-header p { color: var(--text-muted); font-size: 14px; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 2000; }
        .modal-content { background: var(--bg-card); width: 450px; border-radius: 20px; border: 1px solid var(--border); padding: 32px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .modal-header h2 { font-size: 20px; font-weight: 700; }
        
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-size: 13px; color: var(--text-muted); margin-bottom: 8px; }
        .form-group input, .form-group select { width: 100%; background: var(--bg-sidebar); border: 1px solid var(--border-strong); border-radius: 8px; padding: 12px; color: white; outline: none; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }

        .team-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; gap: 20px; }
        .search-box { flex: 1; background: var(--bg-card); border: 1px solid var(--border); padding: 0 16px; border-radius: 12px; display: flex; align-items: center; gap: 12px; }
        .search-box input { background: transparent; border: none; color: white; padding: 12px 0; width: 100%; outline: none; }
        
        .filters { display: flex; gap: 8px; }
        .filter-chip { background: var(--bg-card); border: 1px solid var(--border); padding: 8px 16px; border-radius: 20px; font-size: 13px; color: var(--text-secondary); }
        .filter-chip.active { background: var(--primary-muted); border-color: var(--primary); color: var(--primary); font-weight: 600; }

        .staff-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
        .staff-card { background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border); padding: 24px; transition: var(--transition); }
        .staff-card:hover { border-color: var(--primary); transform: translateY(-4px); }
        
        .card-top { display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px; position: relative; }
        .avatar-large { width: 56px; height: 56px; background: var(--bg-sidebar); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800; border: 2px solid var(--border); }
        
        .status-tag { font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 20px; position: absolute; right: 24px; }
        .status-tag.sur-site { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .status-tag.bureau { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .status-tag.en-congé { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        .card-content h3 { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
        .role-text { font-size: 13px; color: var(--text-muted); display: block; margin-bottom: 16px; }
        .contact-info { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
        .info-row { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--text-secondary); }
        
        .card-footer { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .btn-outline-sm { border: 1px solid var(--border-strong); color: var(--text-secondary); padding: 8px; border-radius: 8px; font-size: 12px; font-weight: 600; text-align: center; }
        
        .btn-primary { background: var(--primary); color: white; padding: 10px 24px; border-radius: 10px; display: flex; align-items: center; gap: 8px; font-weight: 700; min-width: 140px; justify-content: center; }
        .btn-secondary { background: var(--bg-sidebar); color: white; padding: 10px 24px; border-radius: 10px; font-weight: 700; }
        
        .loading-state, .empty-state { grid-column: 1 / -1; text-align: center; padding: 60px; color: var(--text-muted); display: flex; flex-direction: column; align-items: center; gap: 16px; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  )
}

export default Team
