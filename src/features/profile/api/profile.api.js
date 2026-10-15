import api from '../../../lib/axios/api'

async function putProfileResource(path, payload) {
    try {
        const { data } = await api.put(path, payload)
        if (data?.success === false) throw new Error(data.message || 'Impossible d’enregistrer les modifications.')
        return data
    } catch (error) {
        const body = error.response?.data
        throw new Error(Object.values(body?.errors ?? {}).flat().join(' ') || body?.message || error.message || 'Impossible d’enregistrer les modifications.', { cause: error })
    }
}

export const updateProfile = payload => putProfileResource('/api/admin/profile', payload)
export const changePassword = payload => putProfileResource('/api/admin/change-password', payload)

export async function getProfile(signal) {
    try {
        const { data } = await api.get('/api/admin/me', { signal })
        if (data?.success === false || !data?.data) {
            throw new Error(data?.message || 'Impossible de récupérer le profil.')
        }
        return data.data
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Impossible de récupérer le profil.', { cause: error })
    }
}
