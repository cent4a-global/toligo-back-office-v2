import api from '../../../lib/axios/api'

export const COMPANIES_ENDPOINT = null

export async function getCompanies({ signal } = {}) {
    if (!COMPANIES_ENDPOINT) throw new Error('L’endpoint des entreprises reste à configurer.')
    try {
        const response = await api.get(COMPANIES_ENDPOINT, { signal })
        return response.data
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Impossible de charger les entreprises.', { cause: error })
    }
}
