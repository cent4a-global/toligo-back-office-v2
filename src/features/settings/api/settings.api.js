import api from '../../../lib/axios/api'

function readResponse(response) {
    if (response.data?.success === false) {
        const error = new Error(response.data.message || 'Impossible de traiter les parametres.')
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
            .map(message => `${field} : ${message}`),
    )
    return [body?.message || error.message || fallback, ...details].join('\n')
}

export async function getSettings() {
    try {
        const response = await api.get('/api/superadmin/parametres')
        return readResponse(response)
    } catch (error) {
        const message = errorMessage(error, 'Erreur lors de la récupération des paramètres')

        throw new Error(message, { cause: error })
    }
}

export async function updateSetting(key, value) {
    try {
        const response = await api.put(`/api/superadmin/parametres/${encodeURIComponent(key)}`, {
            valeur: value,
        })

        return readResponse(response)
    } catch (error) {
        const message = errorMessage(error, 'Erreur lors de la modification du paramètre')

        throw new Error(message, { cause: error })
    }
}

export async function saveSettings(updates) {
    const results = await Promise.allSettled(
        updates.map(item => updateSetting(item.key, item.value)),
    )
    const failed = results.flatMap((result, index) =>
        result.status === 'rejected'
            ? [`${updates[index].key} : ${result.reason?.message || 'Échec de l’enregistrement.'}`]
            : [],
    )
    if (failed.length) {
        const error = new Error(
            `Certains paramètres n’ont pas été enregistrés.\n${failed.join('\n')}`,
        )
        error.savedKeys = results.flatMap((result, index) =>
            result.status === 'fulfilled' ? [updates[index].key] : [],
        )
        throw error
    }
    return results.map(result => result.value)
}
