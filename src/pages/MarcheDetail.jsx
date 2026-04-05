import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { 
  ArrowLeft, 
  Edit3, 
  Layers, 
  TrendingUp, 
  FileCheck, 
  Clock, 
  AlertTriangle,
  Info,
  Calendar,
  CreditCard,
  ShieldCheck,
  FileText,
  Trash2,
  Eye,
  PlusCircle,
  CheckCircle2,
  HelpCircle
} from 'lucide-react'

const MarcheDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [marche, setMarche] = useState(null)
  const [activeTab, setActiveTab] = useState('infos')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMarche()
  }, [id])

  const fetchMarche = async () => {
    try {
      const marches = await api.getMarches()
      const current = marches.find(m => m.id === parseInt(id))
      setMarche(current)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-20 text-center">Chargement...</div>
  if (!marche) return <div className="p-20 text-center">Marché non trouvé</div>

  const stats = [
    { label: 'Montant DQE', value: `${(marche.valeurHT || 0).toLocaleString()} DA`, sub: `${marche.lots?.length || 0} Lots`, icon: <Layers size={20} /> },
    { label: 'Avenants', value: '0 DA', sub: '0 validés', icon: <TrendingUp size={20} /> },
    { label: 'Total Ajusté TTC', value: `${((marche.valeurHT || 0) * (1 + (marche.tva || 19)/100)).toLocaleString()} DA`, sub: `TVA ${marche.tva || 19}% incluse`, icon: <CreditCard size={20} />, highlight: true },
    { label: 'Délai', value: '12 mois', sub: 'Initial : 12 mois', icon: <Clock size={20} /> },
  ]

  const tabs = [
    { id: 'infos', label: 'INFORMATIONS' },
    { id: 'dqe', label: 'DQE' },
    { id: 'avenants', label: 'AVENANTS' },
    { id: 'attachements', label: 'ATTACHEMENTS' },
    { id: 'situations', label: 'SITUATIONS' },
  ]

  return (
    <div className="marche-detail">
      {/* Header & Breadcrumb */}
      <div className="breadcrumb">
        <button className="back-btn" onClick={() => navigate('/marches')}>
          <ArrowLeft size={16} />
        </button>
        <span>Marchés Publics / {marche.numeroMarche || 'Sans numéro'} / 2024</span>
        <div className="status-badge active">
          <span className="dot"></span> Actif
        </div>
        <button className="edit-marche-btn">
          <Edit3 size={14} /> Modifier
        </button>
      </div>

      <h1 className="marche-title">{marche.operation || 'Nouvelle Opération'}</h1>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {stats.map((stat, i) => (
          <div key={i} className={`kpi-card ${stat.highlight ? 'highlight' : ''}`}>
            <div className="kpi-content">
              <span className="kpi-label">{stat.label}</span>
              <span className="kpi-value">{stat.value}</span>
              <span className="kpi-sub">{stat.sub}</span>
            </div>
            <div className="kpi-icon">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs-header">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {tab.id === 'avenants' && <span className="tab-count">0</span>}
            </button>
          ))}
        </div>

        <div className="tab-content animate-fade-in">
          {activeTab === 'infos' && <InfosTab marche={marche} />}
          {activeTab === 'dqe' && <DQETab marche={marche} onEdit={() => navigate(`/marches/${id}/dqe`)} />}
          {activeTab === 'avenants' && <AvenantsTab />}
          {activeTab === 'attachements' && <AttachementsTab />}
          {activeTab === 'situations' && <SituationsTab />}
        </div>
      </div>

      <style jsx="true">{`
        .marche-detail { padding: 24px; max-width: 1400px; margin: 0 auto; }
        
        .breadcrumb { display: flex; align-items: center; gap: 12px; color: var(--text-muted); font-size: 13px; margin-bottom: 24px; }
        .back-btn { background: var(--bg-card); border: 1px solid var(--border); width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); }
        .status-badge { display: flex; align-items: center; gap: 8px; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 11px; margin-left: 12px; }
        .status-badge.active { background: rgba(34, 197, 94, 0.1); color: #4ade80; }
        .status-badge .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
        .edit-marche-btn { margin-left: auto; background: var(--bg-card); border: 1px solid var(--border); padding: 6px 16px; border-radius: 8px; color: var(--text-secondary); display: flex; align-items: center; gap: 8px; font-size: 12px; }

        .marche-title { font-size: 28px; font-weight: 800; margin-bottom: 32px; letter-spacing: -0.5px; }

        .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
        .kpi-card { background: var(--bg-card); border: 1px solid var(--border); padding: 24px; border-radius: 16px; display: flex; justify-content: space-between; align-items: flex-start; }
        .kpi-card.highlight { border-color: var(--primary); background: linear-gradient(135deg, var(--bg-card) 0%, rgba(249,115,22,0.05) 100%); }
        .kpi-label { display: block; font-size: 13px; color: var(--text-muted); margin-bottom: 8px; font-weight: 500; }
        .kpi-value { display: block; font-size: 22px; font-weight: 800; margin-bottom: 4px; }
        .kpi-card.highlight .kpi-value { color: var(--primary); }
        .kpi-sub { font-size: 12px; color: var(--text-secondary); }
        .kpi-icon { background: var(--bg-sidebar); padding: 10px; border-radius: 12px; color: var(--text-muted); }
        .kpi-card.highlight .kpi-icon { color: var(--primary); background: var(--primary-muted); }

        .tabs-header { display: flex; gap: 40px; border-bottom: 1px solid var(--border); margin-bottom: 32px; }
        .tab-btn { padding: 12px 0; font-size: 13px; font-weight: 700; color: var(--text-muted); position: relative; transition: var(--transition); display: flex; align-items: center; gap: 8px; }
        .tab-btn:hover { color: var(--text-secondary); }
        .tab-btn.active { color: var(--primary); }
        .tab-btn.active::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 2px; background: var(--primary); }
        .tab-count { background: var(--bg-sidebar); padding: 2px 8px; border-radius: 10px; font-size: 10px; }

        /* Infos Tab Styles */
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .info-section { background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border); padding: 24px; }
        .section-title { font-size: 14px; font-weight: 800; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
        .info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.03); }
        .info-row:last-child { border-bottom: none; }
        .info-label { font-size: 13px; color: var(--text-secondary); }
        .info-value { font-size: 14px; font-weight: 600; text-align: right; }
      `}</style>
    </div>
  )
}

const InfosTab = ({ marche }) => (
  <div className="info-grid animate-fade-in">
    <div className="info-section">
      <h3 className="section-title"><User size={16} /> Maître d'Ouvrage</h3>
      <div className="info-row">
        <span className="info-label">Client Principal</span>
        <span className="info-value">{marche.maitreOuvrage}</span>
      </div>
      <div className="info-row">
        <span className="info-label">Wilaya</span>
        <span className="info-value">{marche.wilaya}</span>
      </div>
    </div>

    <div className="info-section">
      <h3 className="section-title"><ShieldCheck size={16} /> Visas Réglementaires</h3>
      <div className="info-row">
        <span className="info-label">Visa CF (Contrôle Financier)</span>
        <span className="info-value">{marche.visaCF || '---'}</span>
      </div>
      <div className="info-row">
        <span className="info-label">Date Visa CF</span>
        <span className="info-value">{marche.dateVisaCF ? new Date(marche.dateVisaCF).toLocaleDateString() : '---'}</span>
      </div>
    </div>

    <div className="info-section">
      <h3 className="section-title"><CreditCard size={16} /> Taux & Pourcentages</h3>
      <div className="info-row">
        <span className="info-label">TVA appliquée</span>
        <span className="info-value">{marche.tva || 19}%</span>
      </div>
      <div className="info-row">
        <span className="info-label">Retenue de Garantie</span>
        <span className="info-value">5%</span>
      </div>
      <div className="info-row">
        <span className="info-label">Prix révisables (Coeff. K)</span>
        <span className="info-value">Oui</span>
      </div>
    </div>

    <div className="info-section">
      <h3 className="section-title"><AlertTriangle size={16} /> Mode de Gestion</h3>
      <div className="p-4 bg-orange-950/20 border border-orange-500/20 rounded-lg">
         <p className="text-sm font-bold text-orange-500 mb-2">Mode Souple (ACTIF)</p>
         <p className="text-xs text-orange-200/60 leading-relaxed">
           Le système émet un avertissement visuel en cas de dépassement des quantités du DQE, 
           mais autorise la validation si l'avenant est en cours.
         </p>
      </div>
    </div>
  </div>
)

const DQETab = ({ marche, onEdit }) => (
  <div className="dqe-container animate-fade-in">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-bold">Détail Quantitatif Estimatif</h3>
      <button className="btn-premium btn-premium-orange" onClick={onEdit}>
        Gérer le DQE
      </button>
    </div>
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-slate-800/50">
          <th className="p-4 text-left text-xs text-muted-foreground font-bold uppercase">Article</th>
          <th className="p-4 text-left text-xs text-muted-foreground font-bold uppercase">Désignation</th>
          <th className="p-4 text-center text-xs text-muted-foreground font-bold uppercase">Unité</th>
          <th className="p-4 text-right text-xs text-muted-foreground font-bold uppercase">P.U. (DA)</th>
        </tr>
      </thead>
      <tbody>
        {marche.lots?.map(lot => (
          <React.Fragment key={lot.id}>
            <tr className="bg-orange-500/10">
              <td colSpan="4" className="p-3 font-bold text-orange-500">{lot.name}</td>
            </tr>
            {lot.sections?.map(section => (
              <React.Fragment key={section.id}>
                <tr className="bg-slate-800/30">
                   <td colSpan="4" className="p-2 pl-6 font-semibold italic text-slate-400">{section.name}</td>
                </tr>
                {section.articles?.map(art => (
                  <tr key={art.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-sm font-mono text-slate-500 pl-8">{art.code}</td>
                    <td className="p-4 text-sm">{art.libelle}</td>
                    <td className="p-4 text-sm text-center font-bold text-slate-400">{art.unite}</td>
                    <td className="p-4 text-sm text-right font-bold text-orange-500">{art.prixUnit?.toLocaleString()}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  </div>
)

const AvenantsTab = () => (
  <div className="p-12 text-center border-2 border-dashed border-white/10 rounded-2xl">
    <TrendingUp className="mx-auto mb-4 text-muted" size={48} />
    <h3 className="text-lg font-bold mb-2">Aucun avenant pour le moment</h3>
    <p className="text-sm text-muted mb-6">Les avenants permettent d'ajuster le montant ou le délai de votre marché.</p>
    <button className="btn-premium btn-premium-orange mx-auto">
      <PlusCircle size={18} /> Nouvel Avenant
    </button>
  </div>
)

const AttachementsTab = () => (
    <div className="grid grid-cols-3 gap-6 animate-fade-in">
      <div className="card-premium h-[200px] flex flex-col items-center justify-center border-dashed group cursor-pointer hover:bg-white/5">
         <PlusCircle className="text-muted group-hover:text-primary transition-colors" size={32} />
         <span className="mt-4 font-bold text-muted group-hover:text-white">Nouvel Attachement</span>
      </div>
      <div className="card-premium">
        <div className="flex justify-between mb-4">
            <span className="text-xs font-bold text-slate-500">N°1</span>
            <span className="badge-status valid">Validé</span>
        </div>
        <h4 className="font-bold mb-2">Terrassements phase 1</h4>
        <p className="text-xs text-muted mb-4">28 janv. 2026 • 2 lignes</p>
        <div className="flex gap-2">
            <button className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"><Eye size={14} /></button>
            <button className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"><FileText size={14} /></button>
        </div>
      </div>
    </div>
)

const SituationsTab = () => (
    <div className="situations-container animate-fade-in">
        <div className="mb-6 bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Info className="text-blue-500" />
                <div>
                   <p className="text-sm font-bold text-blue-200">Anti-Rejet Checklist</p>
                   <p className="text-xs text-blue-400">Assurez-vous que tous les documents sont présents pour éviter le rejet du CF.</p>
                </div>
            </div>
            <button className="text-xs font-bold text-blue-500 hover:underline">Voir checklist →</button>
        </div>
        
        <table className="w-full border-collapse">
            <thead>
                <tr className="border-b border-white/10">
                    <th className="p-4 text-left font-bold text-xs text-muted">N°</th>
                    <th className="p-4 text-left font-bold text-xs text-muted">Période</th>
                    <th className="p-4 text-right font-bold text-xs text-muted">Montant TTC</th>
                    <th className="p-4 text-center font-bold text-xs text-muted">Statut</th>
                    <th className="p-4 text-right font-bold text-xs text-muted">Pièces</th>
                </tr>
            </thead>
            <tbody>
                <tr className="border-b border-white/5">
                    <td className="p-4 font-bold">05</td>
                    <td className="p-4 text-sm">Janvier 2026</td>
                    <td className="p-4 text-right font-bold text-orange-500">19 159 000 DA</td>
                    <td className="p-4 text-center">
                        <span className="badge-status pending">Attente Visa</span>
                    </td>
                    <td className="p-4 text-right">
                        <button className="btn-premium btn-premium-outline !p-2 inline-flex"><FileText size={14} /></button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
)

export default MarcheDetail
