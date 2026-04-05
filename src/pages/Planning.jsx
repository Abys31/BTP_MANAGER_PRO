import React from 'react'
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react'

const tasks = [
  { id: 1, name: 'Installation de chantier', start: 1, duration: 3, color: '#3b82f6' },
  { id: 2, name: 'Terrassements', start: 3, duration: 5, color: '#10b981' },
  { id: 3, name: 'Fondations profonds', start: 7, duration: 8, color: '#f59e0b' },
  { id: 4, name: 'Gros œuvre - RDC', start: 14, duration: 10, color: '#8b5cf6' },
  { id: 5, name: 'Étanchéité', start: 22, duration: 4, color: '#ec4899' },
]

const Planning = () => {
  const days = Array.from({ length: 30 }, (_, i) => i + 1)

  return (
    <div className="planning-page">
      <div className="planning-header">
        <div>
          <h1>Planning & Gantt</h1>
          <p>Calendrier d'exécution des travaux - Avril 2026</p>
        </div>
        <div className="header-actions">
           <div className="date-nav">
             <button className="icon-btn"><ChevronLeft size={20} /></button>
             <span className="current-month">Avril 2026</span>
             <button className="icon-btn"><ChevronRight size={20} /></button>
           </div>
           <button className="btn-primary"><Plus size={18} /> Nouvelle Tâche</button>
        </div>
      </div>

      <div className="gantt-container">
        <div className="gantt-header">
           <div className="task-col">Tâches / Libellés</div>
           <div className="days-col">
             {days.map(d => (
               <div key={d} className="day-cell">{d}</div>
             ))}
           </div>
        </div>

        <div className="gantt-body">
           {tasks.map(task => (
             <div key={task.id} className="gantt-row">
               <div className="task-col">
                 <span className="task-name">{task.name}</span>
               </div>
               <div className="days-col relative">
                 <div 
                   className="task-bar" 
                   style={{ 
                     left: `calc(${(task.start - 1) * 32}px)`, 
                     width: `calc(${task.duration * 32}px)`,
                     backgroundColor: task.color
                   }}
                 >
                   <span className="bar-label">{task.duration}j</span>
                 </div>
                 {days.map(d => (
                   <div key={d} className="day-cell grid-line"></div>
                 ))}
               </div>
             </div>
           ))}
        </div>
      </div>

      <style jsx="true">{`
        .planning-page { color: var(--text-main); }
        .planning-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 32px; }
        .planning-header h1 { font-size: 28px; font-weight: 700; margin-bottom: 4px; }
        .planning-header p { color: var(--text-muted); font-size: 14px; }
        
        .header-actions { display: flex; gap: 20px; align-items: center; }
        .date-nav { display: flex; align-items: center; gap: 12px; background: var(--bg-card); padding: 8px 16px; border-radius: 12px; border: 1px solid var(--border); }
        .current-month { font-weight: 600; font-size: 14px; min-width: 100px; text-align: center; }

        .gantt-container { background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border); overflow-x: auto; }
        .gantt-header { display: flex; border-bottom: 1px solid var(--border); background: rgba(0,0,0,0.1); }
        .task-col { width: 250px; padding: 16px; border-right: 1px solid var(--border); font-size: 13px; font-weight: 600; color: var(--text-secondary); flex-shrink: 0; }
        .days-col { display: flex; flex-grow: 1; }
        .day-cell { width: 32px; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 10px; color: var(--text-muted); border-right: 1px solid rgba(255,255,255,0.05); flex-shrink: 0; }
        
        .gantt-body { display: flex; flex-direction: column; }
        .gantt-row { display: flex; border-bottom: 1px solid var(--border); height: 48px; }
        .gantt-row:hover { background: rgba(255,255,255,0.02); }
        .task-name { font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
        
        .relative { position: relative; }
        .task-bar { position: absolute; height: 24px; top: 12px; border-radius: 6px; display: flex; align-items: center; padding: 0 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.2); z-index: 10; }
        .bar-label { font-size: 10px; font-weight: 800; color: white; white-space: nowrap; }
        .grid-line { height: 48px; }

        .btn-primary { background: var(--primary); color: white; padding: 10px 20px; border-radius: 8px; display: flex; align-items: center; gap: 8px; font-weight: 600; }
        .icon-btn { color: var(--text-muted); transition: var(--transition); }
        .icon-btn:hover { color: var(--primary); }
      `}</style>
    </div>
  )
}

export default Planning
