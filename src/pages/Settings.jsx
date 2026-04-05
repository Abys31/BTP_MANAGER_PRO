import React, { useState, useEffect } from 'react'
import { User, Shield, Lock, Trash2, Mail, CheckCircle2, AlertCircle, Loader2, Save } from 'lucide-react'
import { api } from '../utils/api'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profil')
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('btp_user') || '{}'))
  
  const [profileForm, setProfileForm] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    password: ''
  })

  useEffect(() => {
    if (activeTab === 'securite') {
      fetchUsers()
    }
  }, [activeTab])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await api.getUsers()
      setUsers(data)
    } catch (error) {
      console.error("Erreur utilisateurs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updated = await api.updateProfile(profileForm)
      // Update local storage and state
      const newUser = { ...currentUser, ...updated }
      localStorage.setItem('btp_user', JSON.stringify(newUser))
      setCurrentUser(newUser)
      alert("✅ Profil mis à jour avec succès !")
      setProfileForm({ ...profileForm, password: '' })
    } catch (error) {
      alert("❌ " + (error.message || "Erreur de mise à jour"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Paramètres du Système</h1>
        <p>Gérez vos informations personnelles et la sécurité d'Atlas Manager</p>
      </div>

      <div className="settings-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profil' ? 'active' : ''}`}
          onClick={() => setActiveTab('profil')}
        >
          <User size={18} /> Profil Utilisateur
        </button>
        <button 
          className={`tab-btn ${activeTab === 'securite' ? 'active' : ''}`}
          onClick={() => setActiveTab('securite')}
        >
          <Shield size={18} /> Sécurité & Rôles
        </button>
      </div>

      <div className="settings-content animate-fade-in">
        {activeTab === 'profil' && (
          <div className="tab-pane">
             <div className="pane-header">
                <h3>Informations du Profil</h3>
                <p>Mettez à jour vos informations de connexion et votre identité.</p>
             </div>
             
             <form onSubmit={handleUpdateProfile} className="settings-form">
                <div className="form-group-grid">
                  <div className="form-group">
                    <label>Nom Complet</label>
                    <input 
                      type="text" 
                      value={profileForm.name} 
                      onChange={e => setProfileForm({...profileForm, name: e.target.value})} 
                      placeholder="votre nom" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Adresse E-mail</label>
                    <input 
                      type="email" 
                      value={profileForm.email} 
                      onChange={e => setProfileForm({...profileForm, email: e.target.value})} 
                      placeholder="votre@email.com" 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Changer le mot de passe (Laisser vide pour ne pas changer)</label>
                  <div className="input-with-icon">
                    <Lock size={16} className="icon" />
                    <input 
                      type="password" 
                      value={profileForm.password} 
                      onChange={e => setProfileForm({...profileForm, password: e.target.value})} 
                      placeholder="Nouveau mot de passe secret" 
                    />
                  </div>
                </div>

                <div className="form-footer">
                   <button type="submit" className="btn-primary" disabled={loading}>
                      {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                      Sauvegarder les modifications
                   </button>
                </div>
             </form>
          </div>
        )}

        {activeTab === 'securite' && (
          <div className="tab-pane">
             <div className="pane-header">
                <h3>Gestion des Utilisateurs</h3>
                <p>Liste des comptes ayant accès à Atlas Manager.</p>
             </div>

             <div className="user-table-container">
               <table className="user-table">
                  <thead>
                     <tr>
                        <th>UTILISATEUR</th>
                        <th>RÔLE</th>
                        <th>INSCRIPTION</th>
                        <th>ACTIONS</th>
                     </tr>
                  </thead>
                  <tbody>
                     {loading ? (
                        <tr><td colSpan="4" className="loading-td">Chargement...</td></tr>
                     ) : (
                       users.map(u => (
                        <tr key={u.id}>
                           <td>
                              <div className="user-cell">
                                 <div className="user-avatar">{u.name[0]}</div>
                                 <div className="user-info">
                                    <span className="user-name">{u.name}</span>
                                    <span className="user-email">{u.email}</span>
                                 </div>
                              </div>
                           </td>
                           <td>
                              <span className={`role-badge ${u.role.toLowerCase()}`}>
                                 {u.role === 'ADMIN' ? 'Administrateur' : 'Chef Site'}
                              </span>
                           </td>
                           <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                           <td>
                              <button className="del-btn" title="Suppression limitée"><Trash2 size={16} /></button>
                           </td>
                        </tr>
                       ))
                     )}
                  </tbody>
               </table>
             </div>
          </div>
        )}
      </div>

      <style jsx="true">{`
        .settings-page { max-width: 900px; margin: 0 auto; color: var(--text-main); }
        .settings-header { margin-bottom: 32px; }
        .settings-header h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
        .settings-header p { color: var(--text-muted); font-size: 14px; }

        .settings-tabs { display: flex; gap: 4px; margin-bottom: 24px; background: var(--bg-sidebar); padding: 5px; border-radius: 12px; border: 1px solid var(--border); width: fit-content; }
        .tab-btn { display: flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 8px; font-size: 13.5px; font-weight: 600; color: var(--text-secondary); transition: var(--transition); }
        .tab-btn:hover { color: white; }
        .tab-btn.active { background: var(--bg-card); color: var(--primary); box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid var(--border); }

        .settings-content { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; padding: 32px; overflow: hidden; }
        .pane-header { margin-bottom: 32px; border-bottom: 1px solid var(--border); padding-bottom: 20px; }
        .pane-header h3 { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
        .pane-header p { font-size: 13px; color: var(--text-muted); }

        .settings-form { display: flex; flex-direction: column; gap: 24px; }
        .form-group-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-group label { display: block; font-size: 13px; font-weight: 500; color: var(--text-secondary); margin-bottom: 10px; }
        .form-group input { width: 100%; background: var(--bg-sidebar); border: 1px solid var(--border-strong); border-radius: 10px; padding: 12px; color: white; outline: none; transition: var(--transition); }
        .form-group input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-muted); }

        .input-with-icon { position: relative; }
        .input-with-icon .icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        .input-with-icon input { padding-left: 45px; }

        .form-footer { margin-top: 12px; }
        .btn-primary { background: var(--primary); color: white; padding: 12px 24px; border-radius: 10px; border: none; font-weight: 700; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: 0.3s; }
        .btn-primary:hover { background: var(--primary-hover); transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

        /* User Table */
        .user-table-container { border-radius: 12px; border: 1px solid var(--border); overflow: hidden; }
        .user-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
        .user-table th { background: var(--bg-sidebar); padding: 16px; text-align: left; font-size: 11px; color: var(--text-muted); letter-spacing: 1px; }
        .user-table td { padding: 16px; border-bottom: 1px solid var(--border); }
        
        .user-cell { display: flex; align-items: center; gap: 12px; }
        .user-avatar { width: 36px; height: 36px; background: var(--bg-sidebar); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; border: 2px solid var(--border); color: var(--primary); }
        .user-info { display: flex; flex-direction: column; }
        .user-name { font-weight: 700; color: white; }
        .user-email { font-size: 12px; color: var(--text-muted); }

        .role-badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
        .role-badge.admin { background: rgba(249, 115, 22, 0.1); color: var(--primary); }
        .role-badge.site_manager { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }

        .del-btn { color: var(--text-muted); transition: 0.2s; }
        .del-btn:hover { color: #ef4444; }

        .loading-td { text-align: center; padding: 40px; color: var(--text-muted); }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  )
}

export default Settings
