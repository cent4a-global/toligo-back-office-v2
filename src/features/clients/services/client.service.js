import api from '../../../lib/axios/api'

async function request(method, path, data, fallback, config = {}) {
    try {
        const response = await api.request({ method, url: `/api/admin/clients${path}`, data, ...config })
        return response.data
    } catch (error) {
        throw new Error(error.response?.data?.message || fallback, { cause: error })
    }
}

export const clientService = {
    getClients: ({ signal, page = 1, perPage = 12 } = {}) => request('get', '', undefined, 'Erreur lors de la récupération des clients', { signal, params: { page, per_page: perPage } }),
    getClientById: (id, { signal } = {}) => request('get', `/${encodeURIComponent(id)}`, undefined, 'Erreur lors de la récupération du client', { signal }),
    blockClient: (id, motif) => request('patch', `/${encodeURIComponent(id)}/block`, { motif }, 'Erreur lors du blocage du client'),
    unblockClient: id => request('patch', `/${encodeURIComponent(id)}/unblock`, undefined, 'Erreur lors du déblocage du client'),
}
