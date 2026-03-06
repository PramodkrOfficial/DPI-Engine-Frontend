import axiosInstance from './axiosInstance'

/**
 * dpiApi.js
 * ─────────────────────────────────────────────────────────────
 * All DPI Engine REST API calls in one file.
 * Every function returns an Axios Promise.
 *
 * Pages import what they need:
 *   import { analyzeFile, getRules, blockIp } from '../api/dpiApi'
 * ─────────────────────────────────────────────────────────────
 */

// ══════════════════════════════════════════════════════════════
//  ANALYSIS
// ══════════════════════════════════════════════════════════════

/**
 * Analyze a .pcap file.
 * POST /api/analyze
 * @param {File} file  — the .pcap File object from the browser
 * @param {Function} onProgress — optional upload progress callback (0–100)
 * @returns {Promise<Object>} JSON traffic report from the backend
 */
export const analyzeFile = (file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)

    return axiosInstance.post('/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
            if (onProgress && event.total) {
                const percent = Math.round((event.loaded * 100) / event.total)
                onProgress(percent)
            }
        },
    })
}

// ══════════════════════════════════════════════════════════════
//  FILTERING
// ══════════════════════════════════════════════════════════════

/**
 * Filter a .pcap file — single-threaded.
 * POST /api/filter
 * @param {File} file
 * @param {Function} onProgress — optional upload progress callback
 * @returns {Promise<Blob>} filtered .pcap binary file
 */
export const filterFile = (file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)

    return axiosInstance.post('/filter', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob', // ← tells Axios to return binary data, not JSON
        onUploadProgress: (event) => {
            if (onProgress && event.total) {
                onProgress(Math.round((event.loaded * 100) / event.total))
            }
        },
    })
}

/**
 * Filter a .pcap file — multi-threaded.
 * POST /api/filter/threaded
 * @param {File}   file
 * @param {number} lbs  — number of load balancer threads
 * @param {number} fps  — filters per second
 * @param {Function} onProgress
 * @returns {Promise<Blob>} filtered .pcap binary file
 */
export const filterFileThreaded = (file, lbs = 2, fps = 2, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('lbs', lbs)
    formData.append('fps', fps)

    return axiosInstance.post(`/filter/threaded?lbs=${lbs}&fps=${fps}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
        onUploadProgress: (event) => {
            if (onProgress && event.total) {
                onProgress(Math.round((event.loaded * 100) / event.total))
            }
        },
    })
}

// ══════════════════════════════════════════════════════════════
//  RULES
// ══════════════════════════════════════════════════════════════

/**
 * Get all current blocking rules.
 * GET /api/rules
 * @returns {Promise<{ blockedIps: string[], blockedApps: string[], blockedDomains: string[] }>}
 */
export const getRules = () => axiosInstance.get('/rules')

/**
 * Block an IP address.
 * POST /api/rules/ip/{ip}
 */
export const blockIp = (ip) => axiosInstance.post(`/rules/ip/${encodeURIComponent(ip)}`)

/**
 * Unblock an IP address.
 * DELETE /api/rules/ip/{ip}
 */
export const unblockIp = (ip) => axiosInstance.delete(`/rules/ip/${encodeURIComponent(ip)}`)

/**
 * Block an app type (e.g. 'YOUTUBE').
 * POST /api/rules/app/{app}
 */
export const blockApp = (app) => axiosInstance.post(`/rules/app/${encodeURIComponent(app)}`)

/**
 * Unblock an app type.
 * DELETE /api/rules/app/{app}
 */
export const unblockApp = (app) => axiosInstance.delete(`/rules/app/${encodeURIComponent(app)}`)

/**
 * Block a domain substring (e.g. 'tiktok').
 * POST /api/rules/domain/{keyword}
 */
export const blockDomain = (kw) => axiosInstance.post(`/rules/domain/${encodeURIComponent(kw)}`)

/**
 * Unblock a domain substring.
 * DELETE /api/rules/domain/{keyword}
 */
export const unblockDomain = (kw) => axiosInstance.delete(`/rules/domain/${encodeURIComponent(kw)}`)

/**
 * Clear ALL rules.
 * DELETE /api/rules
 */
export const clearAllRules = () => axiosInstance.delete('/rules')