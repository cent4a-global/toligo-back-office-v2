import api from '../../../lib/axios/api'

export async function getCommunes({ signal } = {}) {
    try {
        const response = await api.get('/api/geo/localites', { signal })
        const body = response.data
        if (body?.success === false)
            throw new Error(body.message || 'Impossible de charger les communes.')
        const communes = Array.isArray(body) ? body : body?.data
        if (!Array.isArray(communes))
            throw new Error('Le format de la liste des communes est invalide.')
        return communes
    } catch (error) {
        throw new Error(
            error.response?.data?.message || error.message || 'Impossible de charger les communes.',
            { cause: error },
        )
    }
}
