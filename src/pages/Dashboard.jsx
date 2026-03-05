import React from 'react'
import './Dashboard.css'

const APPS = [
  'YOUTUBE','FACEBOOK','TWITTER','INSTAGRAM','TIKTOK','NETFLIX',
  'AMAZON','MICROSOFT','APPLE','GITHUB','CLOUDFLARE','TWITCH',
  'DISCORD','REDDIT','LINKEDIN','WHATSAPP','TELEGRAM','ZOOM',
  'DROPBOX','GOOGLE','HTTP','HTTPS','DNS','UNKNOWN'
]

const STATS = [
  { label: 'Analyze PCAP',  desc: 'JSON traffic report',   endpoint: 'POST /api/analyze',         color: 'var(--accent)'  },
  { label: 'Filter PCAP',   desc: 'Download filtered file', endpoint: 'POST /api/filter',          color: 'var(--accent3)' },
  { label: 'MT Filter',     desc: 'Multi-threaded filter',  endpoint: 'POST /api/filter/threaded', color: 'var(--warn)'    },
  { label: 'Rule Manager',  desc: 'IP · App · Domain',      endpoint: 'GET /api/rules',            color: 'var(--danger)'  },
]

export default function Dashboard({ onNavigate }) {
  return (
    <div className="dashboard">
      <header className="dash-header">
        <div>
          <div className="dash-eyebrow mono">Deep Packet Inspection</div>
          <h1 className="dash-title">DPI Engine<span className="accent-dot">.</span></h1>
          <p className="dash-sub">
            Spring Boot · Java 17 · PCAP Analysis · Real-time Traffic Classification
          </p>
        </div>
        <div className="dash-badge mono">v2.0.0</div>
      </header>

      <section className="quick-actions">
        {STATS.map((s, i) => (
          <button
            key={i}
            className="action-card"
            style={{ '--card-color': s.color }}
            onClick={() => {
              if (s.label === 'Analyze PCAP') onNavigate('analyze')
              else if (s.label === 'Rule Manager') onNavigate('rules')
              else onNavigate('filter')
            }}
          >
            <div className="ac-endpoint mono">{s.endpoint}</div>
            <div className="ac-label">{s.label}</div>
            <div className="ac-desc">{s.desc}</div>
            <div className="ac-arrow">→</div>
          </button>
        ))}
      </section>

      <section className="how-section">
        <h2 className="section-title">How It Works</h2>
        <div className="pipeline">
          {[
            { step: '01', title: 'Read PCAP',    desc: 'Parse Wireshark / tcpdump capture file' },
            { step: '02', title: 'Parse Headers', desc: 'Ethernet → IPv4 → TCP/UDP extraction' },
            { step: '03', title: 'SNI Inspect',  desc: 'TLS Client Hello domain extraction (HTTPS too)' },
            { step: '04', title: 'Classify',     desc: 'Assign flow to YouTube, Netflix, etc.' },
            { step: '05', title: 'Apply Rules',  desc: 'Block by IP, app type, or domain substring' },
            { step: '06', title: 'Output',       desc: 'Filtered PCAP + JSON report' },
          ].map((p, i) => (
            <div key={i} className="pipeline-step">
              <div className="ps-num mono">{p.step}</div>
              <div>
                <div className="ps-title">{p.title}</div>
                <div className="ps-desc">{p.desc}</div>
              </div>
              {i < 5 && <div className="ps-arrow">›</div>}
            </div>
          ))}
        </div>
      </section>

      <section className="apps-section">
        <h2 className="section-title">Supported App Types <span className="mono" style={{fontSize:'13px',color:'var(--text3)'}}>({APPS.length})</span></h2>
        <div className="apps-grid">
          {APPS.map(a => (
            <span key={a} className="app-tag mono">{a}</span>
          ))}
        </div>
      </section>

      <section className="arch-section">
        <h2 className="section-title">Architecture Map</h2>
        <div className="arch-table">
          <div className="arch-row arch-head">
            <span>C++ Origin</span><span>Java Equivalent</span>
          </div>
          {[
            ['pcap_reader.cpp','PcapReader.java'],
            ['packet_parser.cpp','PacketParser.java'],
            ['sni_extractor.cpp','SniExtractor.java'],
            ['types.h / types.cpp','AppType.java · FiveTuple.java · Flow.java'],
            ['rule_manager.h','RuleManager.java'],
            ['connection_tracker.h','ConnectionTracker.java'],
            ['main_working.cpp','DpiEngineService.processSingleThreaded()'],
            ['dpi_mt.cpp','DpiEngineService.processMultiThreaded()'],
            ['(new)','DpiController.java — REST API'],
          ].map(([cpp, java], i) => (
            <div key={i} className="arch-row">
              <span className="mono" style={{color:'var(--warn)'}}>{cpp}</span>
              <span className="mono" style={{color:'var(--accent)'}}>{java}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
