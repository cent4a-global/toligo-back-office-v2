import api from '../../../lib/axios/api'

async function get(url, message, config = {}) {
    try { return (await api.get(url, config)).data }
    catch (error) { throw new Error(error.response?.data?.message || message, { cause: error }) }
}
const id = value => encodeURIComponent(value)
export const locationService = {
    getAllLocations: (config = {}) => get('/api/superadmin/locations', 'Erreur lors de la récupération des locations', config),
    getLocationsByEntrepot: (value, config = {}) => get(`/api/admin/entrepots/${id(value)}/locations`, 'Erreur lors de la récupération des locations de l’entrepôt', config),
    getLocationsByClient: (value, config = {}) => get(`/api/superadmin/clients/${id(value)}/locations`, 'Erreur lors de la récupération des locations du client', config),
    getLocationsByCaisse: (value, config = {}) => get(`/api/superadmin/caisses/${id(value)}/locations`, 'Erreur lors de la récupération des locations de la caisse', config),
    getLocationStatistiques: ({ date_debut, date_fin }, config = {}) => get('/api/superadmin/locations/statistiques', 'Erreur lors de la récupération des statistiques', { ...config, params: { date_debut, date_fin } }),
    getSoldeGeniusPay: (config = {}) => get('/api/superadmin/get-solde-geniuspay', 'Erreur lors de la récupération du solde GeniusPay', config),
}
