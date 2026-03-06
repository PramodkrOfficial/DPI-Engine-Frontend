

import React, { useState } from "react";
import { analyzeFile } from "../api/dpiApi";
import "./PageCommon.css";

export default function Analyze() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [drag, setDrag] = useState(false);

  const handleFile = (f) => {
    if (f && f.name.endsWith(".pcap")) {
      setFile(f);
      setError(null);
      setResult(null);
    } else setError("Please select a valid .pcap file.");
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const submit = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setProgress(0);
    try {
      const response = await analyzeFile(file, setProgress);
      setResult(response.data);
    } catch (err) {
      setError(err.userMessage || err.message);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-eyebrow mono">POST /api/analyze</div>
        <h1 className="page-title">Analyze PCAP</h1>
        <p className="page-sub">
          Upload a Wireshark / tcpdump capture to get a detailed JSON traffic
          report.
        </p>
      </div>

      <div
        className={`drop-zone ${drag ? "dragging" : ""} ${file ? "has-file" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onClick={() => document.getElementById("pcap-input-a").click()}
      >
        <input
          id="pcap-input-a"
          type="file"
          accept=".pcap"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {file ? (
          <>
            <div className="dz-icon">◈</div>
            <div className="dz-filename mono">{file.name}</div>
            <div className="dz-size">{(file.size / 1024).toFixed(1)} KB</div>
          </>
        ) : (
          <>
            <div className="dz-icon">⬡</div>
            <div className="dz-label">Drop your .pcap file here</div>
            <div className="dz-hint">or click to browse</div>
          </>
        )}
      </div>

      {loading && progress > 0 && (
        <div className="progress-wrap">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
          <span className="progress-label mono">{progress}%</span>
        </div>
      )}

      {error && <div className="error-banner">{error}</div>}

      <button
        className="submit-btn"
        onClick={submit}
        disabled={!file || loading}
      >
        {loading ? (
          <>
            <span className="spinner" /> Analyzing…
          </>
        ) : (
          "→ Run Analysis"
        )}
      </button>

      {result && (
        <div className="result-box">
          <div className="result-header">
            <span className="mono" style={{ color: "var(--accent3)" }}>
              ✓ Analysis Complete
            </span>
            <button
              className="copy-btn"
              onClick={() =>
                navigator.clipboard.writeText(JSON.stringify(result, null, 2))
              }
            >
              Copy JSON
            </button>
          </div>
          <pre className="result-json mono">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}







// import React, { useState, useEffect } from 'react'

// import './PageCommon.css'
// import './Rules.css'

// const APPS = [
//   'YOUTUBE','FACEBOOK','TWITTER','INSTAGRAM','TIKTOK','NETFLIX',
//   'AMAZON','MICROSOFT','APPLE','GITHUB','CLOUDFLARE','TWITCH',
//   'DISCORD','REDDIT','LINKEDIN','WHATSAPP','TELEGRAM','ZOOM',
//   'DROPBOX','GOOGLE','HTTP','HTTPS','DNS'
// ]

// export default function Rules() {
//   const [rules, setRules]   = useState({ blockedIps: [], blockedApps: [], blockedDomains: [] })
//   const [loading, setLoading] = useState(false)
//   const [error, setError]   = useState(null)

//   const [ipInput, setIpInput]       = useState('')
//   const [domainInput, setDomainInput] = useState('')
//   const [selApp, setSelApp]         = useState(APPS[0])

//   const fetchRules = async () => {
//     setLoading(true)
//     try {
//       const res  = await fetch('/api/rules')
//       const data = await res.json()
//       setRules(data)
//     } catch (e) { setError(e.message) }
//     finally { setLoading(false) }
//   }

//   useEffect(() => { fetchRules() }, [])

//   const addRule = async (type, value) => {
//     await fetch(`/api/rules/${type}/${encodeURIComponent(value)}`, { method: 'POST' })
//     fetchRules()
//   }

//   const delRule = async (type, value) => {
//     await fetch(`/api/rules/${type}/${encodeURIComponent(value)}`, { method: 'DELETE' })
//     fetchRules()
//   }

//   const clearAll = async () => {
//     await fetch('/api/rules', { method: 'DELETE' })
//     fetchRules()
//   }

//   return (
//     <div className="page">
//       <div className="page-header">
//         <div className="page-eyebrow mono">GET · POST · DELETE /api/rules</div>
//         <h1 className="page-title">Rule Manager</h1>
//         <p className="page-sub">Block or unblock traffic by IP address, application type, or domain substring.</p>
//       </div>

//       {error && <div className="error-banner">{error}</div>}

//       <div className="rules-grid">
//         {/* IP Rules */}
//         <div className="rule-card">
//           <div className="rule-card-header">
//             <span className="rc-title">Blocked IPs</span>
//             <span className="rc-count mono">{rules.blockedIps?.length ?? 0}</span>
//           </div>
//           <div className="rule-input-row">
//             <input
//               className="rule-input mono"
//               placeholder="192.168.1.50"
//               value={ipInput}
//               onChange={e => setIpInput(e.target.value)}
//               onKeyDown={e => e.key === 'Enter' && ipInput && (addRule('ip', ipInput), setIpInput(''))}
//             />
//             <button
//               className="rule-add-btn"
//               onClick={() => { if (ipInput) { addRule('ip', ipInput); setIpInput('') } }}
//             >+</button>
//           </div>
//           <div className="rule-list">
//             {rules.blockedIps?.length === 0 && <div className="rule-empty mono">No blocked IPs</div>}
//             {rules.blockedIps?.map(ip => (
//               <div key={ip} className="rule-item">
//                 <span className="mono ri-val" style={{color:'var(--danger)'}}>{ip}</span>
//                 <button className="ri-del" onClick={() => delRule('ip', ip)}>✕</button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* App Rules */}
//         <div className="rule-card">
//           <div className="rule-card-header">
//             <span className="rc-title">Blocked Apps</span>
//             <span className="rc-count mono">{rules.blockedApps?.length ?? 0}</span>
//           </div>
//           <div className="rule-input-row">
//             <select
//               className="rule-input mono"
//               value={selApp}
//               onChange={e => setSelApp(e.target.value)}
//             >
//               {APPS.map(a => <option key={a} value={a}>{a}</option>)}
//             </select>
//             <button className="rule-add-btn" onClick={() => addRule('app', selApp)}>+</button>
//           </div>
//           <div className="rule-list">
//             {rules.blockedApps?.length === 0 && <div className="rule-empty mono">No blocked apps</div>}
//             {rules.blockedApps?.map(app => (
//               <div key={app} className="rule-item">
//                 <span className="mono ri-val" style={{color:'var(--warn)'}}>{app}</span>
//                 <button className="ri-del" onClick={() => delRule('app', app)}>✕</button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Domain Rules */}
//         <div className="rule-card">
//           <div className="rule-card-header">
//             <span className="rc-title">Blocked Domains</span>
//             <span className="rc-count mono">{rules.blockedDomains?.length ?? 0}</span>
//           </div>
//           <div className="rule-input-row">
//             <input
//               className="rule-input mono"
//               placeholder="tiktok"
//               value={domainInput}
//               onChange={e => setDomainInput(e.target.value)}
//               onKeyDown={e => e.key === 'Enter' && domainInput && (addRule('domain', domainInput), setDomainInput(''))}
//             />
//             <button
//               className="rule-add-btn"
//               onClick={() => { if (domainInput) { addRule('domain', domainInput); setDomainInput('') } }}
//             >+</button>
//           </div>
//           <div className="rule-list">
//             {rules.blockedDomains?.length === 0 && <div className="rule-empty mono">No blocked domains</div>}
//             {rules.blockedDomains?.map(d => (
//               <div key={d} className="rule-item">
//                 <span className="mono ri-val" style={{color:'var(--accent3)'}}>{d}</span>
//                 <button className="ri-del" onClick={() => delRule('domain', d)}>✕</button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="rules-actions">
//         <button className="refresh-btn" onClick={fetchRules} disabled={loading}>
//           {loading ? 'Loading…' : '↻ Refresh'}
//         </button>
//         <button className="danger-btn" onClick={clearAll}>
//           ✕ Clear All Rules
//         </button>
//       </div>
//     </div>
//   )
// }
