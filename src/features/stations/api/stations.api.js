import api from '../../../lib/axios/api'
import { stationErrorMessage } from '../utils/stationErrors'

function readResponse(response) {
    if (response.data?.success === false) throw new Error(response.data.message || 'Operation impossible.')
    return response.data
}

export async function getStations() {
    try {
        const response = await api.get('/api/superadmin/stations')

        return readResponse(response)
    } catch (error) {
        const message =
            error.response?.data?.message || error.message || 'Erreur lors de la récupération des stations'

        throw new Error(message, {
            cause: error,
        })
    }
}

export async function getStationById(id) {
    try {
        const response = await api.get(`/api/superadmin/stations/${id}`)

        return readResponse(response)
    } catch (error) {
        const message =
            error.response?.data?.message || error.message || 'Erreur lors de la récupération de la station'

        throw new Error(message, {
            cause: error,
        })
    }
}

export async function createStation(stationData) {
    try {
        const response = await api.post('/api/superadmin/stations', stationData)

        return readResponse(response)
    } catch (error) {
        const message = stationErrorMessage(error, 'Erreur lors de la création de la station')

        throw new Error(message, {
            cause: error,
        })
    }
}

export async function updateStation(id, stationData) {
    try {
        const response = await api.put(`/api/superadmin/stations/${id}`, stationData)

        return readResponse(response)
    } catch (error) {
        const message = stationErrorMessage(error, 'Erreur lors de la mise à jour de la station')

        throw new Error(message, {
            cause: error,
        })
    }
}

export async function deleteStation(id) {
    try {
        const response = await api.delete(`/api/superadmin/stations/${id}`)

        const data = response.data

        if (data?.success === false) {
            throw new Error(data.message || 'Impossible de supprimer cette station')
        }

        return data
    } catch (error) {
        if (error.message && !error.response) {
            throw error
        }

        const message =
            error.response?.data?.message || error.message || 'Erreur lors de la suppression de la station'

        throw new Error(message, {
            cause: error,
        })
    }
}
