import { useMutation, useQueryClient } from '@tanstack/react-query'
import { smartlockService } from '../api/smart-lock.service'

export const useSmartlock = () => {
    const queryClient = useQueryClient()
    const invalidateBoxes = () => { void queryClient.invalidateQueries({ queryKey: ['boxes'] }) }

    const syncSmartLocksMutation = useMutation({
        mutationFn: entrepotId => smartlockService.syncSmartLocks(entrepotId),
        meta: { successMessage: 'Serrures synchronisées.' },
        onSuccess: invalidateBoxes,
    })

    const unsyncSmartLocksMutation = useMutation({
        mutationFn: smartLockIds => smartlockService.unsyncSmartLocks(smartLockIds),
        meta: { silentSuccess: true, successMessage: 'Serrures désynchronisées.' },
        onSuccess: invalidateBoxes,
    })

    const replaceSmartLockMutation = useMutation({
        mutationFn: ({ smartLockId, newLockname }) =>
            smartlockService.replaceSmartLock(smartLockId, newLockname),
        meta: { silentSuccess: true, successMessage: 'Serrure remplacée.' },
        onSuccess: invalidateBoxes,
    })

    return {
        syncSmartLocks: syncSmartLocksMutation.mutate,
        syncSmartLocksAsync: syncSmartLocksMutation.mutateAsync,
        isSyncing: syncSmartLocksMutation.isPending,
        syncError: syncSmartLocksMutation.error,
        syncData: syncSmartLocksMutation.data,

        unsyncSmartLocks: unsyncSmartLocksMutation.mutate,
        unsyncSmartLocksAsync: unsyncSmartLocksMutation.mutateAsync,
        isUnsyncing: unsyncSmartLocksMutation.isPending,
        unsyncError: unsyncSmartLocksMutation.error,
        unsyncData: unsyncSmartLocksMutation.data,

        replaceSmartLock: replaceSmartLockMutation.mutate,
        replaceSmartLockAsync: replaceSmartLockMutation.mutateAsync,
        isReplacing: replaceSmartLockMutation.isPending,
        replaceError: replaceSmartLockMutation.error,
        replaceData: replaceSmartLockMutation.data,
    }
}
