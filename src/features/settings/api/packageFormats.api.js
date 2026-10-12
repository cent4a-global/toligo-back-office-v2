import api from '../../../lib/axios/api'

async function request(operation) {
    try {
        const response = await operation()
        if (response.data?.success === false) throw new Error(response.data.message)
        return response.data
    } catch (error) {
        const body = error.response?.data
        const details = Object.values(body?.errors ?? {}).flat().filter(item => typeof item === 'string')
        throw new Error([body?.message || error.message || 'Impossible de traiter le format.', ...details].join('\n'), { cause: error })
    }
}

export async function getPackageFormats() {
    const body = await request(() => api.get('/api/superadmin/formats-colis'))
    const formats = Array.isArray(body) ? body : body?.data?.data ?? body?.data
    if (!Array.isArray(formats)) throw new Error('La liste des formats reçue est invalide.')
    return formats
}

export function createPackageFormat(payload) {
    return request(() => api.post('/api/superadmin/formats-colis', payload))
}

export function updatePackageFormat(id, payload) {
    return request(() => api.put(`/api/client/formats-colis/${encodeURIComponent(id)}`, payload))
}
