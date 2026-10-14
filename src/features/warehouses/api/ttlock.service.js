import api from '../../../lib/axios/api'

const getTtlockCredentials = async (entrepotId, { signal } = {}) => {
    try {
        const response = await api.get(`/api/admin/entrepots/${entrepotId}/ttlock-credentials`, { signal })
        return response.data
    } catch (error) {
        if (error.code === 'ERR_CANCELED') throw error
        const message = error.response?.data?.message || 'Erreur lors de la récupération des identifiants TTLock'
        throw new Error(message, { cause: error })
    }
}

const resetTtlockPassword = async entrepotId => {
    try {
        const response = await api.post(`/api/superadmin/entrepots/${entrepotId}/ttlock-reset-password`)
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || 'Erreur lors de la réinitialisation du mot de passe TTLock'
        throw new Error(message, { cause: error })
    }
}

export const ttlockService = {
    getTtlockCredentials,
    resetTtlockPassword,
}
