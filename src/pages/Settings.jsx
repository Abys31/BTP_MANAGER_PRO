import React from 'react'
import { Settings as SettingsIcon, User, Lock, Bell, Shield } from 'lucide-react'

const Settings = () => {
  return (
    <div className="settings-page">
      <h1>Paramètres du Système</h1>
      <div className="settings-grid">
        <div className="settings-card">
          <User size={20} />
          <div className="settings-info">
            <h4>Profil Utilisateur</h4>
            <p>Gérer vos informations personnelles et votre avatar.</p>
          </div>
        </div>
        <div className="settings-card">
          <Shield size={20} />
          <div className="settings-info">
            <h4>Sécurité & Rôles</h4>
            <p>Définir les permissions pour les chefs de chantier et administrateurs.</p>
          </div>
        </div>
      </div>
      <style jsx="true">{`
        .settings-page h1 { font-size: 24px; margin-bottom: 24px; }
        .settings-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
        .settings-card { background: var(--bg-card); padding: 20px; border-radius: 12px; border: 1px solid var(--border); display: flex; align-items: center; gap: 20px; cursor: pointer; transition: var(--transition); }
        .settings-card:hover { border-color: var(--primary); background: var(--bg-hover); }
        .settings-info h4 { font-size: 15px; margin-bottom: 4px; }
        .settings-info p { font-size: 13px; color: var(--text-muted); }
      `}</style>
    </div>
  )
}

export default Settings
