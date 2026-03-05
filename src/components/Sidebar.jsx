import React from 'react'
import './Sidebar.css'

const NAV = [
  { id: 'dashboard', label: 'Dashboard',    icon: '⬡' },
  { id: 'analyze',   label: 'Analyze PCAP', icon: '◈' },
  { id: 'filter',    label: 'Filter PCAP',  icon: '⬘' },
  { id: 'rules',     label: 'Rule Manager', icon: '⬙' },
]

export default function Sidebar({ current, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <span className="logo-pulse" />
          DPI
        </div>
        <div className="logo-sub">Engine v2.0</div>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(n => (
          <button
            key={n.id}
            className={`nav-item ${current === n.id ? 'active' : ''}`}
            onClick={() => onNavigate(n.id)}
          >
            <span className="nav-icon">{n.icon}</span>
            <span className="nav-label">{n.label}</span>
            {current === n.id && <span className="nav-bar" />}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="status-dot" />
        <span className="mono" style={{ fontSize: '11px', color: 'var(--text3)' }}>
          localhost:8080
        </span>
      </div>
    </aside>
  )
}
