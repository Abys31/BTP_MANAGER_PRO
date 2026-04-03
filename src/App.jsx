import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import MarchesPublics from './pages/MarchesPublics'
import ChantierMode from './pages/ChantierMode'
import Logistics from './pages/Logistics'
import Finance from './pages/Finance'
import Documents from './pages/Documents'
import Settings from './pages/Settings'

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="layout">
      <Sidebar isOpen={isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />
      
      <main className="main-content">
        <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        
        <div className="content-page animate-fade-in">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/marches" element={<MarchesPublics />} />
            <Route path="/chantier" element={<ChantierMode />} />
            <Route path="/logistics" element={<Logistics />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<div>Page en construction</div>} />
          </Routes>
        </div>
      </main>

      <style jsx="true">{`
        .content-page {
          padding: 24px;
          flex: 1;
        }
      `}</style>
    </div>
  )
}

export default App
