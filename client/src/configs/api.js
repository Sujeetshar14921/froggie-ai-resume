import axios from 'axios'
import toast from 'react-hot-toast'

const configuredBaseUrl = import.meta.env.VITE_BASE_URL?.trim()
const isLocalhostUrl = configuredBaseUrl && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/i.test(configuredBaseUrl)
const baseURL = configuredBaseUrl && (!import.meta.env.PROD || !isLocalhostUrl)
    ? configuredBaseUrl
    : (import.meta.env.DEV ? 'http://localhost:3000' : undefined)

const api = axios.create({
    baseURL
})

// Global interceptor for rate-limiting and session handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 429) {
            const msg = error.response.data?.message || 'Usage rate limit reached. Please slow down and try again in a few moments.'
            toast.error(msg, { id: 'rate-limit-toast', duration: 4000 })
        }
        return Promise.reject(error)
    }
)

export { baseURL as API_BASE_URL }
export default api