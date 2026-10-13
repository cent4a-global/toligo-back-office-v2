import api from '../../../lib/axios/api'
import { isAdminUuid } from '../utils/adminUuid'

export async function assignWarehouseAdmins(id, adminIds) {
    if (!Array.isArray(adminIds) || adminIds.some(value => !isAdminUuid(value))) {
        throw new Error('Chaque administrateur sélectionné doit avoir un UUID valide.')
    }
    try {
        const response = await api.post(`/api/superadmin/entrepots/${id}/admins`, {
            admin_ids: [...new Set(adminIds.map(value => value.trim()))],
        })
        if (response.data?.success === false) {
            throw new Error(response.data.message || 'Impossible de modifier les administrateurs.')
        }
        return response.data
    } catch (error) {
        const body = error.response?.data
        const validation = Object.values(body?.errors ?? {}).flat().join(' ')
        throw new Error(validation || body?.message || error.message || 'Impossible de modifier les administrateurs.', { cause: error })
    }
}

function normalizeWarehouse(warehouse) {
    return {
        ...warehouse,
        name: warehouse.nom ?? warehouse.name,
        address: warehouse.adresse ?? warehouse.address,
        locality: warehouse.commune?.nom ?? warehouse.commune?.name ?? warehouse.locality,
    }
}

// Récupérer la liste des entrepôts
export async function getWarehouses() {
    try {
        const response = await api.get('/api/admin/entrepots')

        const body = response.data
        if (Array.isArray(body)) return { data: body.map(normalizeWarehouse) }
        return { ...body, data: Array.isArray(body.data) ? body.data.map(normalizeWarehouse) : [] }
    } catch (error) {
        const message =
            error.response?.data?.message || 'Erreur lors de la récupération des entrepôts'

        throw new Error(message, {
            cause: error,
        })
    }
}

// Récupérer un entrepôt par ID
export async function getWarehouseById(id) {
    try {
        const response = await api.get(`/api/admin/entrepots/${id}`)

        const body = response.data
        return body.data
            ? { ...body, data: normalizeWarehouse(body.data) }
            : { data: normalizeWarehouse(body) }
    } catch (error) {
        const message =
            error.response?.data?.message || "Erreur lors de la récupération de l'entrepôt"

        throw new Error(message, {
            cause: error,
        })
    }
}

// Créer un entrepôt
export async function createWarehouse(warehouseData) {
    try {
        const response = await api.post('/api/superadmin/entrepots', warehouseData)

        if (response.data?.success === false) {
            throw new Error(response.data.message || "Impossible d'enregistrer cet entrepôt.")
        }
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Erreur lors de la création de l'entrepôt"

        throw new Error(message, {
            cause: error,
        })
    }
}

// Mettre à jour un entrepôt
export async function updateWarehouse(id, warehouseData) {
    try {
        const response = await api.put(`/api/superadmin/entrepots/${id}`, warehouseData)

        if (response.data?.success === false) {
            throw new Error(response.data.message || "Impossible d'enregistrer cet entrepôt.")
        }
        return response.data
    } catch (error) {
        const message =
            error.response?.data?.message || error.message || "Erreur lors de la mise à jour de l'entrepôt"

        throw new Error(message, {
            cause: error,
        })
    }
}

// Supprimer un entrepôt
export async function deleteWarehouse(id) {
    try {
        const response = await api.delete(`/api/superadmin/entrepots/${id}`)

        const data = response.data

        if (data.success === false) {
            throw new Error(data.message || 'Impossible de supprimer cet entrepôt')
        }

        return data
    } catch (error) {
        if (error.message && !error.response) {
            throw error
        }

        const message =
            error.response?.data?.message || "Erreur lors de la suppression de l'entrepôt"

        throw new Error(message, {
            cause: error,
        })
    }
}
