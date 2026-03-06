import axios from 'axios'

/**
 * axiosInstance.js
 * ─────────────────────────────────────────────────────────────
 * A configured Axios instance for all DPI Engine API calls.
 *
 * Base URL is set to '/api' — Vite's dev-server proxy forwards
 * every /api/* request to http://localhost:8080, so CORS is
 * never an issue during development.
 *
 * For production, change VITE_API_BASE_URL in your .env file
 * to the real backend URL (e.g. https://your-server.com/api).
 * ─────────────────────────────────────────────────────────────
 */
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 60000, // 60 s — pcap analysis can take a while
    headers: {
        Accept: 'application/json',
    },
})

// ── Request Interceptor ────────────────────────────────────────
// Runs before every outgoing request.
// Good place to attach auth tokens if you add auth later.
axiosInstance.interceptors.request.use(
    (config) => {
        // Example: attach a bearer token from localStorage
        // const token = localStorage.getItem('token')
        // if (token) config.headers.Authorization = `Bearer ${token}`
        console.debug(`[DPI API] ${config.method?.toUpperCase()} ${config.url}`)
        return config
    },
    (error) => Promise.reject(error),
)

// ── Response Interceptor ──────────────────────────────────────
// Runs on every response (or error) that comes back.
// Normalises error messages so every page gets a clean string.
axiosInstance.interceptors.response.use(
    (response) => response, // success — pass through unchanged

    (error) => {
        let message = 'An unexpected error occurred.'

        if (error.code === 'ECONNABORTED') {
            message = 'Request timed out. The server may be busy processing a large file.'
        } else if (!error.response) {
            // Network error — backend not reachable at all
            message =
                'Cannot reach the backend. Make sure the Spring Boot server is running on port 8080.'
        } else {
            // HTTP error (4xx / 5xx)
            const status = error.response.status
            switch (status) {
                case 400:
                    message = 'Bad request — check that you uploaded a valid .pcap file.'
                    break
                case 404:
                    message = 'API endpoint not found (404). Check the backend is running correctly.'
                    break
                case 500:
                    message = 'Internal server error (500). See backend logs for details.'
                    break
                default:
                    message = `Server returned an error (HTTP ${status}).`
            }
        }

        // Attach the human-readable message so pages can just use error.userMessage
        error.userMessage = message
        return Promise.reject(error)
    },
)

export default axiosInstance