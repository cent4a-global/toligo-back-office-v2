import api from '../../../lib/axios/api'

function readResponse(response) {
    if (response.data?.success === false) {
        const error = new Error(response.data.message || 'Operation impossible sur les hubs.')
        error.response = response
        throw error
    }
    return response.data
}

function errorMessage(error, fallback) {
    const body = error.response?.data
    const details = Object.entries(body?.errors ?? {}).flatMap(([field, messages]) =>
        (Array.isArray(messages) ? messages : [messages])
            .filter(message => typeof message === 'string')
            .map(message => `${field} : ${message}`))
    return [body?.message || error.message || fallback, ...details].join('\n')
}

export async function getHubs() {
    try {
        const response = await api.get('/api/superadmin/hubs')

        return readResponse(response)
    } catch (error) {
        const message = errorMessage(error, 'Erreur lors de la récupération des hubs')

        throw new Error(message, {
            cause: error,
        })
    }
}

export async function getHubById(id) {
    try {
        const response = await api.get(`/api/superadmin/hubs/${id}`)

        return readResponse(response)
    } catch (error) {
        const message = errorMessage(error, 'Erreur lors de la récupération du hub')

        throw new Error(message, {
            cause: error,
        })
    }
}

export async function createHub(hubData) {
    try {
        const response = await api.post('/api/superadmin/hubs', hubData)

        return readResponse(response)
    } catch (error) {
        const message = errorMessage(error, 'Erreur lors de la création du hub')

        throw new Error(message, {
            cause: error,
        })
    }
}

export async function updateHub(id, hubData) {
    try {
        const response = await api.put(`/api/superadmin/hubs/${id}`, hubData)

        return readResponse(response)
    } catch (error) {
        const message = errorMessage(error, 'Erreur lors de la mise à jour du hub')

        throw new Error(message, {
            cause: error,
        })
    }
}

export async function deleteHub(id) {
    try {
        const response = await api.delete(`/api/superadmin/hubs/${id}`)

        const data = response.data

        if (data?.success === false) {
            throw new Error(data.message || 'Impossible de supprimer ce hub')
        }

        return data
    } catch (error) {
        if (error.message && !error.response) {
            throw error
        }

        const message = errorMessage(error, 'Erreur lors de la suppression du hub')

        throw new Error(message, {
            cause: error,
        })
    }
}
