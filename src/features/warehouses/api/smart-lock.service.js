import api from '../../../lib/axios/api'

const syncSmartLocks = async entrepotId => {
    try {
        const response = await api.post(`/api/superadmin/entrepots/${entrepotId}/smart-locks/sync`)
        return response.data
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la synchronisation des serrures', { cause: error })
    }
}

const unsyncSmartLocks = async smartLockIds => {
    const ids = Array.isArray(smartLockIds) ? smartLockIds : [smartLockIds]
    const validIds = ids.filter(id => id != null && id !== '')

    if (validIds.length === 0) {
        throw new Error('Aucun ID de serrure valide à désynchroniser')
    }

    try {
        const response = await api.post('/api/superadmin/smart-locks/unsync-bulk', {
            smart_lock_ids: validIds,
        })
        return response.data
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la désynchronisation des serrures', { cause: error })
    }
}

const replaceSmartLock = async (smartLockId, newLockname) => {
    try {
        const response = await api.post(`/api/superadmin/smart-locks/${smartLockId}/replace`, {
            new_lockname: newLockname,
        })
        return response.data
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors du remplacement de la serrure', { cause: error })
    }
}

export const smartlockService = {
    syncSmartLocks,
    unsyncSmartLocks,
    replaceSmartLock,
}
