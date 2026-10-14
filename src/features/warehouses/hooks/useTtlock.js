import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ttlockService } from '../api/ttlock.service'
import { ttlockKeys } from '../queries/ttlockKeys'

export { ttlockKeys } from '../queries/ttlockKeys'

export const useTtlockCredentials = entrepotId => {
    const ttlockQuery = useQuery({
        queryKey: ttlockKeys.detail(entrepotId),
        queryFn: ({ signal }) => ttlockService.getTtlockCredentials(entrepotId, { signal }),
        enabled: Boolean(entrepotId),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        select: data => data?.data ?? null,
    })

    return {
        credentials: ttlockQuery.data,
        isLoading: ttlockQuery.isLoading,
        isError: ttlockQuery.isError,
        error: ttlockQuery.error,
        refetch: ttlockQuery.refetch,
    }
}

export const useTtlockResetPassword = () => {
    const queryClient = useQueryClient()
    const resetMutation = useMutation({
        mutationFn: entrepotId => ttlockService.resetTtlockPassword(entrepotId),
        meta: { successMessage: 'Mot de passe TTLock réinitialisé.' },
        onSuccess: (_data, entrepotId) => queryClient.invalidateQueries({
            queryKey: ttlockKeys.detail(entrepotId),
        }),
    })

    return {
        resetPassword: resetMutation.mutate,
        resetPasswordAsync: resetMutation.mutateAsync,
        isResetting: resetMutation.isPending,
        resetError: resetMutation.error,
        resetData: resetMutation.data,
    }
}
