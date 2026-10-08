// src/api/api.js
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

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
        const token = localStorage.getItem('admin_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => Promise.reject(error),
)

// Intercepteur pour gérer les erreurs globales
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('admin_token')
            localStorage.removeItem('admin_data')

            const currentPath = window.location.pathname
            if (!currentPath.includes('/login')) {
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    },
)

export default api
