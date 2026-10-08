import api from '../../../lib/axios/api'

export async function getClients({ signal, page = 1, perPage = 10 } = {}) {
    try {
        const response = await api.get('/api/admin/clients', { signal, params: { page, per_page: perPage } })

        return response.data
    } catch (error) {
        const message =
            error.response?.data?.message || 'Erreur lors de la récupération des clients'

        throw new Error(message, {
            cause: error,
        })
    }
}
