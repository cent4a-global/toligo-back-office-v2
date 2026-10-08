// src/api/api.js
import axios from 'axios'
import { clearAuthStorage, getToken } from '../../features/auth/storage/auth.storage'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const isAuthRequest = config => config.url?.startsWith('/api/admin/login') ||
    config.url === '/api/admin/resend-otp' ||
    config.url?.startsWith('/api/admin/forgot-password') ||
    config.url?.startsWith('/api/admin/reset-password')

const api = axios.create({
    baseURL: API_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    timeout: 30000,
})

// Intercepteur pour ajouter le token automatiquement
api.interceptors.request.use(
    config => {
        const token = getToken()
        if (token && !isAuthRequest(config)) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => Promise.reject(error),
)

// Intercepteur pour gérer les erreurs globales
api.interceptors.response.use(
    response => {
        if (response.data?.success === false) {
            throw new Error(response.data.message || 'La demande a échoué.')
        }
        return response
    },
    error => {
        if (error.response?.status === 401 && !isAuthRequest(error.config || {})) {
            clearAuthStorage()

            const currentPath = window.location.pathname
            if (currentPath !== '/login') {
                window.location.replace('/login')
            }
        }
        return Promise.reject(error)
    },
)

export default api
