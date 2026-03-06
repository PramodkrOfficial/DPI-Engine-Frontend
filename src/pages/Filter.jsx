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

// import React, { useState } from 'react'
// import './PageCommon.css'

// export default function Filter() {
//   const [file, setFile]         = useState(null)
//   const [mode, setMode]         = useState('single')
//   const [lbs, setLbs]           = useState(2)
//   const [fps, setFps]           = useState(2)
//   const [loading, setLoading]   = useState(false)
//   const [done, setDone]         = useState(false)
//   const [error, setError]       = useState(null)
//   const [drag, setDrag]         = useState(false)

//   const handleFile = f => {
//     if (f && f.name.endsWith('.pcap')) { setFile(f); setError(null); setDone(false) }
//     else setError('Please select a valid .pcap file')
//   }

//   const onDrop = e => {
//     e.preventDefault(); setDrag(false)
//     handleFile(e.dataTransfer.files[0])
//   }

//   const submit = async () => {
//     if (!file) return
//     setLoading(true); setDone(false); setError(null)
//     const fd = new FormData()
//     fd.append('file', file)
//     const url = mode === 'multi'
//       ? `/api/filter/threaded?lbs=${lbs}&fps=${fps}`
//       : '/api/filter'
//     if (mode === 'multi') { fd.append('lbs', lbs); fd.append('fps', fps) }
//     try {
//       const res = await fetch(url, { method: 'POST', body: fd })
//       if (!res.ok) throw new Error(`HTTP ${res.status}`)
//       const blob = await res.blob()
//       const a = document.createElement('a')
//       a.href = URL.createObjectURL(blob)
//       a.download = mode === 'multi' ? 'filtered_mt.pcap' : 'filtered.pcap'
//       a.click()
//       setDone(true)
//     } catch (e) {
//       setError(e.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="page">
//       <div className="page-header">
//         <div className="page-eyebrow mono">POST /api/filter  ·  /api/filter/threaded</div>
//         <h1 className="page-title">Filter PCAP</h1>
//         <p className="page-sub">Download a filtered PCAP with blocked packets removed. Choose single or multi-threaded processing.</p>
//       </div>

//       <div className="mode-toggle">
//         {['single','multi'].map(m => (
//           <button
//             key={m}
//             className={`mode-btn ${mode === m ? 'active' : ''}`}
//             onClick={() => setMode(m)}
//           >
//             {m === 'single' ? '◈ Single Thread' : '⬘ Multi-Thread'}
//           </button>
//         ))}
//       </div>

//       {mode === 'multi' && (
//         <div className="thread-params">
//           <div className="param-group">
//             <label className="param-label mono">lbs (load balancers)</label>
//             <input
//               type="number" min="1" max="16" value={lbs}
//               className="param-input mono"
//               onChange={e => setLbs(+e.target.value)}
//             />
//           </div>
//           <div className="param-group">
//             <label className="param-label mono">fps (filters per sec)</label>
//             <input
//               type="number" min="1" max="16" value={fps}
//               className="param-input mono"
//               onChange={e => setFps(+e.target.value)}
//             />
//           </div>
//         </div>
//       )}

//       <div
//         className={`drop-zone ${drag ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
//         onDragOver={e => { e.preventDefault(); setDrag(true) }}
//         onDragLeave={() => setDrag(false)}
//         onDrop={onDrop}
//         onClick={() => document.getElementById('pcap-input-f').click()}
//       >
//         <input
//           id="pcap-input-f" type="file" accept=".pcap"
//           style={{ display: 'none' }}
//           onChange={e => handleFile(e.target.files[0])}
//         />
//         {file ? (
//           <>
//             <div className="dz-icon">◈</div>
//             <div className="dz-filename mono">{file.name}</div>
//             <div className="dz-size">{(file.size / 1024).toFixed(1)} KB</div>
//           </>
//         ) : (
//           <>
//             <div className="dz-icon">⬘</div>
//             <div className="dz-label">Drop your .pcap file here</div>
//             <div className="dz-hint">or click to browse</div>
//           </>
//         )}
//       </div>

//       {error && <div className="error-banner">{error}</div>}
//       {done  && <div className="success-banner mono">✓ Filtered PCAP downloaded successfully</div>}

//       <button
//         className="submit-btn"
//         onClick={submit}
//         disabled={!file || loading}
//       >
//         {loading
//           ? <><span className="spinner" /> Filtering…</>
//           : `→ Filter & Download${mode === 'multi' ? ' (MT)' : ''}`}
//       </button>
//     </div>
//   )
// }
