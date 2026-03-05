import React, { useState } from 'react'
import './PageCommon.css'

export default function Filter() {
  const [file, setFile]         = useState(null)
  const [mode, setMode]         = useState('single')
  const [lbs, setLbs]           = useState(2)
  const [fps, setFps]           = useState(2)
  const [loading, setLoading]   = useState(false)
  const [done, setDone]         = useState(false)
  const [error, setError]       = useState(null)
  const [drag, setDrag]         = useState(false)

  const handleFile = f => {
    if (f && f.name.endsWith('.pcap')) { setFile(f); setError(null); setDone(false) }
    else setError('Please select a valid .pcap file')
  }

  const onDrop = e => {
    e.preventDefault(); setDrag(false)
    handleFile(e.dataTransfer.files[0])
  }

  const submit = async () => {
    if (!file) return
    setLoading(true); setDone(false); setError(null)
    const fd = new FormData()
    fd.append('file', file)
    const url = mode === 'multi'
      ? `/api/filter/threaded?lbs=${lbs}&fps=${fps}`
      : '/api/filter'
    if (mode === 'multi') { fd.append('lbs', lbs); fd.append('fps', fps) }
    try {
      const res = await fetch(url, { method: 'POST', body: fd })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = mode === 'multi' ? 'filtered_mt.pcap' : 'filtered.pcap'
      a.click()
      setDone(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-eyebrow mono">POST /api/filter  ·  /api/filter/threaded</div>
        <h1 className="page-title">Filter PCAP</h1>
        <p className="page-sub">Download a filtered PCAP with blocked packets removed. Choose single or multi-threaded processing.</p>
      </div>

      <div className="mode-toggle">
        {['single','multi'].map(m => (
          <button
            key={m}
            className={`mode-btn ${mode === m ? 'active' : ''}`}
            onClick={() => setMode(m)}
          >
            {m === 'single' ? '◈ Single Thread' : '⬘ Multi-Thread'}
          </button>
        ))}
      </div>

      {mode === 'multi' && (
        <div className="thread-params">
          <div className="param-group">
            <label className="param-label mono">lbs (load balancers)</label>
            <input
              type="number" min="1" max="16" value={lbs}
              className="param-input mono"
              onChange={e => setLbs(+e.target.value)}
            />
          </div>
          <div className="param-group">
            <label className="param-label mono">fps (filters per sec)</label>
            <input
              type="number" min="1" max="16" value={fps}
              className="param-input mono"
              onChange={e => setFps(+e.target.value)}
            />
          </div>
        </div>
      )}

      <div
        className={`drop-zone ${drag ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onClick={() => document.getElementById('pcap-input-f').click()}
      >
        <input
          id="pcap-input-f" type="file" accept=".pcap"
          style={{ display: 'none' }}
          onChange={e => handleFile(e.target.files[0])}
        />
        {file ? (
          <>
            <div className="dz-icon">◈</div>
            <div className="dz-filename mono">{file.name}</div>
            <div className="dz-size">{(file.size / 1024).toFixed(1)} KB</div>
          </>
        ) : (
          <>
            <div className="dz-icon">⬘</div>
            <div className="dz-label">Drop your .pcap file here</div>
            <div className="dz-hint">or click to browse</div>
          </>
        )}
      </div>

      {error && <div className="error-banner">{error}</div>}
      {done  && <div className="success-banner mono">✓ Filtered PCAP downloaded successfully</div>}

      <button
        className="submit-btn"
        onClick={submit}
        disabled={!file || loading}
      >
        {loading
          ? <><span className="spinner" /> Filtering…</>
          : `→ Filter & Download${mode === 'multi' ? ' (MT)' : ''}`}
      </button>
    </div>
  )
}
