import api from '../../../lib/axios/api'

export async function getInternalUsers({ signal, page = 1, perPage = 10 } = {}) {
    try {
        const response = await api.get('/api/superadmin/admins', { signal, params: { page, per_page: perPage } })

        return response.data
    } catch (error) {
        const message =
            error.response?.data?.message || 'Erreur lors de la récupération des membres internes'

        throw new Error(message, {
            cause: error,
        })
    }
}
