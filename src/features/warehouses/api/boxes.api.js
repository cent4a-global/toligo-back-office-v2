import api from '../../../lib/axios/api'

export async function getBoxes(signal) {
    try {
        const { data } = await api.get('/api/admin/caisses', { signal })
        if (data?.success === false) throw new Error(data.message || 'Impossible de charger les caisses.')
        if (!Array.isArray(data?.data)) throw new Error('La liste des caisses reçue est invalide.')
        return data.data
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Impossible de charger les caisses.', { cause: error })
    }
}

export async function deleteBox(id) {
    try {
        const { data } = await api.delete(`/api/admin/caisses/${encodeURIComponent(id)}`)
        if (data?.success === false) throw new Error(data.message || 'Impossible de supprimer la caisse.')
        return data
    } catch (error) {
        const body = error.response?.data
        throw new Error(Object.values(body?.errors ?? {}).flat().join(' ') || body?.message || error.message || 'Impossible de supprimer la caisse.', { cause: error })
    }
}

export async function updateBox(id, payload) {
    try {
        const { data } = await api.put(`/api/admin/caisses/${encodeURIComponent(id)}`, payload)
        if (data?.success === false)
            throw new Error(data.message || 'Impossible de modifier la caisse.')
        return data
    } catch (error) {
        const body = error.response?.data
        throw new Error(
            Object.values(body?.errors ?? {})
                .flat()
                .join(' ') ||
                body?.message ||
                error.message ||
                'Impossible de modifier la caisse.',
            { cause: error },
        )
    }
}

export async function getBoxById(id, signal) {
    try {
        const { data } = await api.get(`/api/admin/caisses/${encodeURIComponent(id)}`, { signal })
        if (data?.success === false)
            throw new Error(data.message || 'Impossible de récupérer la caisse.')
        return data
    } catch (error) {
        throw new Error(
            error.response?.data?.message || error.message || 'Impossible de récupérer la caisse.',
            { cause: error },
        )
    }
}

export async function createBox(payload) {
    try {
        const { data } = await api.post('/api/admin/caisses/', payload)
        if (data?.success === false)
            throw new Error(data.message || 'Impossible de créer la caisse.')
        return data
    } catch (error) {
        const body = error.response?.data
        throw new Error(
            Object.values(body?.errors ?? {})
                .flat()
                .join(' ') ||
                body?.message ||
                error.message ||
                'Impossible de créer la caisse.',
            { cause: error },
        )
    }
}
