import React, { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Analyze from './pages/Analyze.jsx'
import Filter from './pages/Filter.jsx'
import Rules from './pages/Rules.jsx'
import './App.css'

export default function App() {
  const [page, setPage] = useState('dashboard')

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard onNavigate={setPage} />
      case 'analyze':   return <Analyze />
      case 'filter':    return <Filter />
      case 'rules':     return <Rules />
      default:          return <Dashboard onNavigate={setPage} />
    }
  }

  return (
    <div className="app-shell">
      <Sidebar current={page} onNavigate={setPage} />
      <main className="app-main">
        {renderPage()}
      </main>
    </div>
  )
}
