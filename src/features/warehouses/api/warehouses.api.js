import api from '../../../lib/axios/api'

// Récupérer la liste des entrepôts
export async function getWarehouses() {
    try {
        const response = await api.get('/api/admin/entrepots')

        return response.data
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

        return response.data
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

        return response.data
    } catch (error) {
        const message = error.response?.data?.message || "Erreur lors de la création de l'entrepôt"

        throw new Error(message, {
            cause: error,
        })
    }
}

// Mettre à jour un entrepôt
export async function updateWarehouse(id, warehouseData) {
    try {
        const response = await api.put(`/api/superadmin/entrepots/${id}`, warehouseData)

        return response.data
    } catch (error) {
        const message =
            error.response?.data?.message || "Erreur lors de la mise à jour de l'entrepôt"

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
