import api from '../../../lib/axios/api'
export const DRIVERS_ENDPOINT = null

export async function getDrivers({ signal } = {}) {
    if (!DRIVERS_ENDPOINT) throw new Error('L’endpoint des livreurs reste à configurer.')
    try {
        const response = await api.get(DRIVERS_ENDPOINT, { signal })

        return response.data
    } catch (error) {
        const message =
            error.response?.data?.message || 'Erreur lors de la récupération des livreurs'

        throw new Error(message, {
            cause: error,
        })
    }
}
