import api from '../../../lib/axios/api'

function readResponse(response) {
    if (response.data?.success === false) {
        throw new Error(response.data.message || 'Operation impossible sur les zones.')
    }
    return response.data
}

export async function getZones() {
    try {
        const response = await api.get('/api/superadmin/zones')

        return readResponse(response)
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            'Erreur lors de la récupération des zones'

        throw new Error(message, {
            cause: error,
        })
    }
}

export async function getZoneById(id) {
    try {
        const response = await api.get(`/api/superadmin/zones/${id}`)

        return readResponse(response)
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            'Erreur lors de la récupération de la zone'

        throw new Error(message, {
            cause: error,
        })
    }
}

export async function createZone(zoneData) {
    try {
        const response = await api.post('/api/superadmin/zones', zoneData)

        return readResponse(response)
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            'Erreur lors de la création de la zone'

        throw new Error(message, {
            cause: error,
        })
    }
}

export async function updateZone(id, zoneData) {
    try {
        const response = await api.put(`/api/superadmin/zones/${id}`, zoneData)

        return readResponse(response)
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            'Erreur lors de la modification de la zone'

        throw new Error(message, {
            cause: error,
        })
    }
}

export async function deleteZone(id) {
    try {
        const response = await api.delete(`/api/superadmin/zones/${id}`)

        const data = response.data

        if (data?.success === false) {
            throw new Error(data.message || 'Impossible de supprimer cette zone')
        }

        return data
    } catch (error) {
        if (error.message && !error.response) {
            throw error
        }

        const message =
            error.response?.data?.message ||
            error.message ||
            'Erreur lors de la suppression de la zone'

        throw new Error(message, {
            cause: error,
        })
    }
}
