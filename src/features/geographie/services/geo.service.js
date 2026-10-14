import api from '../../../lib/axios/api'

async function get(url, message, signal) {
    try { return (await api.get(url, { signal })).data }
    catch (error) { throw new Error(error.response?.data?.message || message, { cause: error }) }
}
export const geoService = {
    getVilles: ({ signal } = {}) => get('/api/geo/villes', 'Erreur lors de la récupération des villes', signal),
    getCommunesByVille: (id, { signal } = {}) => get(`/api/geo/villes/${encodeURIComponent(id)}/communes`, 'Erreur lors de la récupération des communes', signal),
}
